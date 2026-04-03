interface MindMapNode {
  label: string;
  subtopics?: MindMapNode[];
}

async function callGroq(systemPrompt: string, userPrompt: string): Promise<MindMapNode> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    console.warn('No GROQ API key found');
    throw new Error('No API key');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 2048,
    })
  });

  if (!response.ok) throw new Error(`Groq error: ${response.status}`);

  const data = await response.json();
  const content = data.choices[0].message.content.trim();
  const clean = content.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}

const SYSTEM_PROMPT = `You are a mind map generator. Return ONLY valid JSON, no markdown, no backticks, no explanation.
Format: { "label": "Topic", "subtopics": [ { "label": "Unique Subtopic", "subtopics": [ { "label": "Specific Detail" } ] } ] }
Rules:
- Every label must be UNIQUE and SPECIFIC to the topic — never generic
- 4-6 subtopics at level 1, 2-3 at level 2
- Labels: concise, 2-5 words max
- Make branches genuinely different from each other`;

const EXPAND_PROMPT = `You are a mind map expander. Return ONLY valid JSON, no markdown, no backticks.
Format: { "label": "Same label", "subtopics": [ { "label": "Deep specific insight" }, ... ] }
Rules:
- Generate 4-5 DEEP, SPECIFIC subtopics for the given node
- Each subtopic should be a unique angle or insight about the topic
- Labels: concise, 2-5 words, no repetition
- Go deeper than surface level — think like an expert`;

export async function generateMindMap(topic: string): Promise<MindMapNode> {
  try {
    return await callGroq(SYSTEM_PROMPT, `Generate a detailed mind map for: "${topic}". Make every node specific and unique.`);
  } catch {
    return getFallback(topic);
  }
}

// ✨ NEW — expands a single node deeper on click
export async function expandNode(label: string): Promise<MindMapNode> {
  try {
    return await callGroq(EXPAND_PROMPT, `Expand this mind map node with deep, specific subtopics: "${label}"`);
  } catch {
    return {
      label,
      subtopics: [
        { label: `${label} — core idea` },
        { label: `${label} — advanced use` },
        { label: `${label} — real examples` },
        { label: `${label} — common mistakes` },
      ]
    };
  }
}

function getFallback(topic: string): MindMapNode {
  return {
    label: topic,
    subtopics: [
      { label: 'Core Concepts', subtopics: [{ label: 'Fundamentals' }, { label: 'Key Principles' }] },
      { label: 'Applications', subtopics: [{ label: 'Real-world Use' }, { label: 'Case Studies' }] },
      { label: 'Tools & Methods', subtopics: [{ label: 'Popular Tools' }, { label: 'Best Practices' }] },
      { label: 'Future Trends', subtopics: [{ label: 'Emerging Ideas' }, { label: 'Research Areas' }] },
    ]
  };
}
