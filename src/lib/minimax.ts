interface MindMapNode {
  label: string;
  subtopics?: MindMapNode[];
}

export async function generateMindMap(topic: string): Promise<MindMapNode> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    console.warn('No GROQ API key found, using fallback');
    return getFallback(topic);
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a mind map generator. Return ONLY a valid JSON object, no markdown, no backticks, no explanation.
Format: { "label": "Main Topic", "subtopics": [ { "label": "Unique Subtopic", "subtopics": [ { "label": "Specific Detail" } ] } ] }
Rules:
- Each label must be UNIQUE and SPECIFIC to the topic
- 4-6 subtopics at level 1
- 2-3 subtopics at level 2
- Labels should be concise (2-5 words)
- Make each branch genuinely different from others`
          },
          {
            role: 'user',
            content: `Generate a detailed, specific mind map for: "${topic}". Make every node label unique and relevant.`
          }
        ],
        temperature: 0.8,
        max_tokens: 2048,
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    const clean = content.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    
    if (!parsed.label || !parsed.subtopics) throw new Error('Invalid structure');
    return parsed;

  } catch (error) {
    console.error('API Error:', error);
    return getFallback(topic);
  }
}

function getFallback(topic: string): MindMapNode {
  return {
    label: topic,
    subtopics: [
      {
        label: 'Core Concepts',
        subtopics: [{ label: 'Fundamentals' }, { label: 'Key Principles' }]
      },
      {
        label: 'Applications',
        subtopics: [{ label: 'Real-world Use' }, { label: 'Case Studies' }]
      },
      {
        label: 'Tools & Methods',
        subtopics: [{ label: 'Popular Tools' }, { label: 'Best Practices' }]
      },
      {
        label: 'Future Trends',
        subtopics: [{ label: 'Emerging Ideas' }, { label: 'Research Areas' }]
      }
    ]
  };
}