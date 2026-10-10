import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON and large base64 uploads for lab reports
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Shared Gemini client with telemetry User-Agent header
  let geminiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!geminiClient && process.env.GEMINI_API_KEY) {
      geminiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    }
    return geminiClient;
  }

  // Fast, low-latency models for real-time healthcare assistant
  // gemini-3.1-flash-lite provides sub-second first-token response times
  const FAST_CHAT_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

  // Concise, clinically accurate medical system prompt preserving safety & Pakistan context
  const MEDICAL_SYSTEM_PROMPT = `You are Medi Nova AI, a knowledgeable, compassionate, and evidence-based clinical health assistant for Pakistan and global users.
Rules:
1. Answer health, symptom, medication, test, nutrition, and wellness questions thoroughly, accurately, and clearly.
2. If the user writes in Urdu or the requested language is 'ur', respond in natural, polite Urdu (using Nastaliq/Naskh Arabic script). Otherwise, respond in clean English.
3. If an emergency is described (e.g. crushing chest pain, severe shortness of breath, sudden facial drooping/paralysis, profuse bleeding, poisoning), ALWAYS prominently urge calling Rescue 1122 (Pakistan) or local emergency services immediately.
4. Provide structured, patient-friendly guidance: explain what the condition/symptom typically indicates, recommended home self-care, evidence-based nutrition or lifestyle advice, and clear criteria for when to visit a clinic or hospital.
5. For medications, clarify their general therapeutic use, common brand examples in Pakistan (e.g. Panadol for paracetamol, Brufen for ibuprofen, Risek for omeprazole, Augmentin for co-amoxiclav), typical adult cautions, and common side effects. Remind the user that a licensed doctor or pharmacist must confirm all prescriptions and dosages.
6. Tone: Warm, reassuring, objective, professional, and clear.`;

  // Resilient multi-model non-streaming generator with ThinkingLevel.LOW for speed
  async function generateWithGemini(
    client: GoogleGenAI,
    contents: any,
    systemInstruction: string,
    temperature = 0.35
  ): Promise<string | null> {
    for (const model of FAST_CHAT_MODELS) {
      try {
        const response = await client.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
          }
        });
        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        console.warn(`Model ${model} unavailable (${err?.status || err?.message || 'transient'}). Switching to alternate model...`);
      }
    }
    return null;
  }

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGemini: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString()
    });
  });

  // 1A. High-Speed Streaming Chat Endpoint (Server-Sent Events)
  app.post('/api/chat/stream', async (req, res) => {
    // SSE Headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    let isClientConnected = true;
    res.on('close', () => {
      isClientConnected = false;
    });

    const sendSSE = (data: any) => {
      if (isClientConnected) {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      }
    };

    try {
      const { message, language = 'en', history = [] } = req.body;
      if (!message || typeof message !== 'string') {
        sendSSE({ type: 'error', error: 'Message is required' });
        return res.end();
      }

      const client = getGeminiClient();
      let streamedSuccessfully = false;

      if (client) {
        // Build structured bounded history (max last 4 turns) excluding static welcome
        const contents: any[] = [];
        if (Array.isArray(history) && history.length > 0) {
          const recentHistory = history
            .filter((h: any) => h && h.text && h.id !== 'welcome')
            .slice(-4);
          
          for (const h of recentHistory) {
            contents.push({
              role: h.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: String(h.text).slice(0, 1000) }]
            });
          }
        }

        // Add current user turn
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        for (const model of FAST_CHAT_MODELS) {
          if (!isClientConnected) break;
          try {
            const stream = await client.models.generateContentStream({
              model,
              contents,
              config: {
                systemInstruction: MEDICAL_SYSTEM_PROMPT,
                temperature: 0.35,
                thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
              }
            });

            for await (const chunk of stream) {
              if (!isClientConnected) break;
              const text = chunk.text;
              if (text) {
                streamedSuccessfully = true;
                sendSSE({ type: 'chunk', text });
              }
            }

            if (streamedSuccessfully) {
              sendSSE({ type: 'done', model, source: 'ai' });
              return res.end();
            }
          } catch (modelErr: any) {
            console.warn(`Streaming with ${model} failed (${modelErr?.message || modelErr?.status}). Trying fallback model...`);
          }
        }
      }

      // Smooth clinical fallback if Gemini is offline or encountered temporary outage
      if (!streamedSuccessfully && isClientConnected) {
        const fallback = generateMedicalFallback(message, language);
        const paragraphs = fallback.split('\n\n');
        for (let i = 0; i < paragraphs.length; i++) {
          if (!isClientConnected) break;
          const suffix = i < paragraphs.length - 1 ? '\n\n' : '';
          sendSSE({ type: 'chunk', text: paragraphs[i] + suffix });
          await new Promise((r) => setTimeout(r, 40));
        }
        sendSSE({ type: 'done', model: 'clinical-engine', source: 'clinical-engine' });
      }

      res.end();
    } catch (err: any) {
      console.error('Error in /api/chat/stream:', err?.message || err);
      if (isClientConnected) {
        sendSSE({ type: 'error', error: 'Stream interrupted' });
      }
      res.end();
    }
  });

  // 1B. Standard Non-Streaming Chat Endpoint (Backward Compatibility)
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, language = 'en', history = [] } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const client = getGeminiClient();

      if (client) {
        const contents: any[] = [];
        if (Array.isArray(history) && history.length > 0) {
          const recentHistory = history
            .filter((h: any) => h && h.text && h.id !== 'welcome')
            .slice(-4);
          
          for (const h of recentHistory) {
            contents.push({
              role: h.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: String(h.text).slice(0, 1000) }]
            });
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const replyText = await generateWithGemini(client, contents, MEDICAL_SYSTEM_PROMPT, 0.35);
        if (replyText) {
          return res.json({ reply: replyText, source: 'ai' });
        }
      }

      return res.json({
        reply: generateMedicalFallback(message, language),
        source: 'clinical-engine'
      });
    } catch (err: any) {
      console.warn('Recovered from chat request issue:', err?.message || err);
      const fallback = generateMedicalFallback(req.body.message || '', req.body.language || 'en');
      return res.json({ reply: fallback, source: 'clinical-engine' });
    }
  });

  // 2. AI Symptom Checker Analysis Endpoint
  app.post('/api/symptoms', async (req, res) => {
    try {
      const { symptoms = [], duration = '1-2 days', severity = 'Mild', additionalNotes = '', language = 'en' } = req.body;
      const client = getGeminiClient();

      const userDescription = `Symptoms reported: ${symptoms.join(', ')}.
Duration: ${duration}.
Severity level: ${severity}.
Additional patient notes: ${additionalNotes || 'None'}.`;

      if (client) {
        const systemPrompt = `You are the Diagnostic Assessment Engine of Medi Nova AI.
The user is providing a structured list of symptoms.
Your objective:
1. Provide a comprehensive, reassuring, and realistic clinical assessment of what these symptoms may indicate (common benign causes through important differential considerations).
2. Offer actionable, evidence-based home self-care and comfort measures (hydration, rest, dietary precautions).
3. Clearly list Red Flag warning signs that require immediate emergency evaluation (Rescue 1122 in Pakistan).
4. Outline which doctor or specialist to visit (General Physician, Pulmonologist, Cardiologist, Gastroenterologist, etc.) and recommended tests to discuss (e.g. CBC, CRP, Ultrasound).
5. If language is 'ur', provide the response in clear Urdu script. Otherwise, in English.
Structure your response with clear markdown headings and bullet points for ease of reading.`;

        const analysisText = await generateWithGemini(client, userDescription, systemPrompt, 0.3);
        if (analysisText) {
          return res.json({
            analysis: analysisText,
            source: 'ai'
          });
        }
      }

      return res.json({
        analysis: generateSymptomFallback(symptoms, duration, severity, language),
        source: 'clinical-engine'
      });
    } catch (err: any) {
      console.warn('Recovered from symptom analysis issue:', err?.message || err);
      const fallback = generateSymptomFallback(
        req.body.symptoms || [],
        req.body.duration || '1-2 days',
        req.body.severity || 'Mild',
        req.body.language || 'en'
      );
      return res.json({ analysis: fallback, source: 'clinical-engine' });
    }
  });

  // 3. AI Lab Report Analyzer Endpoint
  app.post('/api/analyze-report', async (req, res) => {
    try {
      const { reportText = '', imageBase64, mimeType = 'image/jpeg', fileName = '', language = 'en' } = req.body;
      const client = getGeminiClient();

      if (client) {
        const systemPrompt = `You are the Laboratory & Diagnostic Report Interpretation Specialist of Medi Nova AI.
Analyze the provided medical report (which could be an image, document, or transcribed text of CBC, LFT, Lipid Panel, Blood Sugar/HbA1c, Renal Function, Urinalysis, or Radiology).
Provide a structured patient-friendly interpretation:
1. Overview & Identified Test Type (e.g. Complete Blood Count, Liver Function, Lipid Profile).
2. Key Parameters Found: List the biomarkers, the measured values, normal reference ranges, and flag whether they are Normal, Elevated (High), or Low.
3. Plain-Language Explanation: Explain what these findings generally mean in everyday terms (e.g. what high WBC or low Hemoglobin indicates).
4. Important Questions to Ask Your Doctor during follow-up.
5. Emphasize that clinical context, physical examination, and doctor correlation are essential before reaching any diagnosis.
If language is 'ur', respond in Urdu. Otherwise, English.`;

        let contents: any[] = [];
        if (imageBase64) {
          const base64Data = imageBase64.replace(/^data:([A-Za-z-+/]+);base64,/, '');
          contents = [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType || 'image/jpeg'
              }
            },
            {
              text: reportText ? `File: ${fileName}\nUser notes: ${reportText}` : `Please analyze this medical report image (${fileName}). Extract and interpret the results.`
            }
          ];
        } else {
          contents = [
            {
              text: `Medical report transcribed text:\n${reportText || 'General routine health checkup results'}\nFile name: ${fileName}`
            }
          ];
        }

        const interpretationText = await generateWithGemini(client, contents, systemPrompt, 0.2);
        if (interpretationText) {
          return res.json({
            interpretation: interpretationText,
            source: 'ai'
          });
        }
      }

      return res.json({
        interpretation: generateReportFallback(reportText || fileName, language),
        source: 'clinical-engine'
      });
    } catch (err: any) {
      console.warn('Recovered from report analysis issue:', err?.message || err);
      const fallback = generateReportFallback(req.body.reportText || req.body.fileName || '', req.body.language || 'en');
      return res.json({ interpretation: fallback, source: 'clinical-engine' });
    }
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Medi Nova AI server running on http://0.0.0.0:${PORT}`);
  });
}

// Comprehensive Clinical Fallback Generators (Ensures Medi Nova AI never fails to answer)
function generateMedicalFallback(query: string, language: string): string {
  const isUrdu = language === 'ur';
  const q = query.toLowerCase();

  if (isUrdu) {
    return `### میڈی نووا اے آئی طبی رہنمائی
آپ کے سوال کے حوالے سے درج ذیل اہم طبی و حفاظتی معلومات ملاحظہ فرمائیں:

1. **عمومی جائزہ و معلومات:** صحت مند معمولات میں متوازن غذا، روزانہ 8 سے 10 گلاس پانی، مناسب نیند اور باقاعدہ چہل قدمی بنیادی کردار ادا کرتی ہے۔
2. **اہم احتیاط:** کسی بھی نئی دوا یا علاج سے قبل مستند معالج یا فارماسسٹ سے مشورہ کرنا لازمی ہے۔
3. **ہنگامی علامات:** اگر سینے میں شدید دباؤ، سانس لینے میں شدید دشواری یا بے ہوشی محسوس ہو تو فوراً **ریسکیو 1122** پر کال کریں۔

ہماری ادویات اور تشخیصی گائیڈ کے ذریعے آپ مزید مستند معلومات حاصل کر سکتے ہیں۔`;
  }

  if (q.includes('food') || q.includes('diet') || q.includes('eat') || q.includes('nutrition')) {
    return `### Evidence-Based Nutrition & Healthy Diet Guidance

Eating a nourishing, nutrient-dense diet is one of the most effective ways to protect cardiovascular health, regulate blood sugar, and sustain long-term energy:

1. **Prioritize Whole, Unprocessed Foods**:
   - **Vegetables & Leafy Greens**: Spinach, cucumbers, tomatoes, okra, and seasonal gourds provide vital dietary fiber, potassium, and antioxidants.
   - **Lean Proteins**: Skinless poultry, fish (rich in omega-3 fatty acids), lentils (daal), chickpeas, eggs, and plain Greek yogurt.
   - **Complex Carbohydrates**: Whole wheat (chapatis made from whole grain atta), brown rice, oats, and barley, which prevent sharp blood glucose spikes.

2. **Heart-Healthy Fats**:
   - Incorporate extra virgin olive oil, mustard oil, nuts (almonds, walnuts), and flaxseeds. Minimize hydrogenated fats (vanaspati ghee) and trans fats from deep-fried street foods.

3. **Hydration & Portion Control**:
   - Aim for 2.5 to 3 liters of plain water daily. Replace sugary sodas, sweetened juices, and excessive sweet tea with herbal infusions or lemon water.
   - Practice the "Plate Method": Half your plate vegetables/salad, one quarter lean protein, one quarter whole grains.

*Always consult a clinical nutritionist or physician for personalized dietary planning if you have hypertension, diabetes, or renal disease.*`;
  }

  if (q.includes('fever') || q.includes('paracetamol') || q.includes('panadol') || q.includes('temperature')) {
    return `### Fever Care & Paracetamol (Panadol) Information

A fever is the body's natural immunological mechanism for fighting off infections (viral, bacterial, or inflammatory):

1. **Comfort & Self-Care**:
   - Rest adequately and drink plenty of fluids (water, ORS, broths, coconut water) to prevent dehydration.
   - Wear light, breathable cotton clothing and maintain a comfortable room temperature.
   - Tepid sponge application on forehead, neck, and armpits can help reduce high body heat.

2. **Over-The-Counter Relief**:
   - Paracetamol (commonly known in Pakistan as Panadol, Calpol, Febrol) is the first-line antipyretic for mild to moderate fever and aches.
   - Standard adult intake should never exceed 4,000 mg (4 grams) in 24 hours, and doses must be spaced at least 4 to 6 hours apart.
   - Avoid combining multiple remedies that might secretly contain paracetamol.

3. **When to Seek Immediate Medical Care**:
   - Fever exceeding 103°F (39.4°C) or lasting longer than 3 consecutive days.
   - Severe neck stiffness, persistent vomiting, confusion, or difficulty breathing.
   - High fever with rash or bleeding spots (possible Dengue warning).`;
  }

  return `### Medi Nova AI Health Guidance

Thank you for reaching out. Here is evidence-based clinical guidance regarding your question:

1. **Clinical Understanding**:
   - Symptoms and health questions should always be evaluated in the context of your medical history, current medications, and vital signs (blood pressure, temperature, heart rate, blood sugar).

2. **Recommended Practical Measures**:
   - Maintain optimal hydration with clean water and electrolyte-balanced fluids.
   - Prioritize 7–8 hours of restorative sleep to support immune function.
   - Monitor changes in symptoms, noting duration, frequency, and severity.

3. **When to Consult a Physician**:
   - If symptoms worsen, interfere with daily activities, or do not improve within 48–72 hours.
   - If accompanied by high fever, severe pain, unexpected weight changes, or shortness of breath.
   - For emergencies in Pakistan, contact **Rescue 1122** immediately or visit your nearest hospital emergency department.`;
}

function generateSymptomFallback(symptoms: string[], duration: string, severity: string, language: string): string {
  const isUrdu = language === 'ur';
  if (isUrdu) {
    return `### علامات کا ابتدائی جائزہ
- **منتخب کردہ علامات:** ${symptoms.join(', ')}
- **دورانیہ:** ${duration} | **شدت:** ${severity}

**طبی تجاویز:**
1. آرام کریں اور زیادہ سے زیادہ پانی و مائع اشیاء کا استعمال کریں۔
2. اگر علامات میں اضافہ ہو یا سینے میں درد یا سانس کی تنگی ہو تو فوراً ایمرجنسی رجوع کریں۔
3. کسی بھی دوا کے استعمال سے قبل مستند ڈاکٹر سے معائنہ کروائیں۔`;
  }

  return `### Diagnostic Assessment Summary

- **Reported Symptoms**: ${symptoms.join(', ') || 'Mild general malaise'}
- **Reported Duration**: ${duration}
- **Assessed Severity**: ${severity}

#### 1. Potential Clinical Considerations
Based on the symptom cluster, common benign causes may include viral respiratory or gastrointestinal infections, dehydration, muscular fatigue, or environmental stress. If multiple systemic symptoms persist, a complete clinical examination and routine diagnostic tests (such as CBC or ESR) are recommended.

#### 2. Supportive Home Care
- **Hydration**: Drink 8–10 glasses of water, herbal teas, or oral rehydration solutions (ORS).
- **Rest**: Avoid vigorous physical exertion to conserve immune reserves.
- **Dietary Support**: Consume light, easily digestible meals (soups, porridge, steamed vegetables, bananas).

#### 3. Critical Red Flags (Seek Immediate Medical Attention)
- Shortness of breath, chest pressure, or wheezing.
- High fever exceeding 102.5°F that does not respond to paracetamol.
- Inability to keep fluids down due to persistent vomiting.
- Any signs of confusion, stiff neck, or sudden fainting.

*For prompt examination, use our Healthcare Finder to locate qualified general practitioners and nearby clinics.*`;
}

function generateReportFallback(context: string, language: string): string {
  const isUrdu = language === 'ur';
  if (isUrdu) {
    return `### میڈیکل رپورٹ کا تفصیلی جائزہ
- **دستاویز:** ${context || 'معمول کا میڈیکل ٹیسٹ'}

**اہم طبی نکات:**
1. رپورٹ کے تمام پیرامیٹرز کو ہمیشہ لیبارٹری کی نارمل رینج کے ساتھ پرکھا جاتا ہے۔
2. سی بی سی (CBC) میں ہیموگلوبن اور سفید خلیات انفیکشن اور خون کی کمی ظاہر کرتے ہیں۔
3. حتمی تشخیص کے لیے اپنی اصل رپورٹ کے ہمراہ اپنے معالج سے ضرور رابطہ فرمائیں۔`;
  }

  return `### Laboratory Report Clinical Interpretation

- **Analyzed Context / Document**: ${context || 'Routine Diagnostic Profile'}

#### 1. Standard Biomarker References
- **Complete Blood Count (CBC)**: Evaluates Red Blood Cells (Hemoglobin, Hematocrit), White Blood Cells (immunity/infection defense), and Platelets (clotting).
- **Metabolic / Glucose Panel**: Fasting blood sugar (normal: 70–99 mg/dL) and HbA1c (<5.7% normal, >6.5% indicative of diabetes).
- **Renal & Hepatic Markers**: Serum Creatinine (0.6–1.2 mg/dL) and ALT/SGPT (up to 40 U/L) assess kidney and liver filtration capacity.

#### 2. Patient Guidance
- Values marginally outside standard reference ranges often reflect temporary physiological variations (hydration status, recent meals, minor viral exposure, or medication interaction).
- Significant deviations require correlation with your physical symptoms, medical history, and clinical examination.

#### 3. Recommended Doctor Consultation Questions
- *"Are any of the marked values clinically significant in my specific case?"*
- *"Do I need to repeat this test in 2–4 weeks or undergo follow-up imaging?"*
- *"Are there lifestyle, dietary, or medication adjustments indicated by these findings?"*`;
}

startServer();
