interface MindMapNode {
  label: string;
  subtopics?: MindMapNode[];
}

async function callMiniMax(systemPrompt: string, userPrompt: string): Promise<MindMapNode> {
  const apiKey = import.meta.env.VITE_MINIMAX_API_KEY;

  if (!apiKey) {
    console.warn('No MiniMax API key found');
    throw new Error('No API key');
  }

  const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'abab6.5-chat',
      messages: [
        {
          sender_type: 'SYSTEM',
          text: systemPrompt
        },
        {
          sender_type: 'USER',
          text: userPrompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    throw new Error(`MiniMax error: ${response.status}`);
  }

  const data = await response.json();

  let content = data.reply?.trim();

  if (!content) {
    throw new Error('Empty response from MiniMax');
  }

  // Clean markdown if model adds it
  const clean = content.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(clean);
  } catch (err) {
    console.error("JSON Parse Failed. Raw output:", clean);
    throw new Error("Invalid JSON from MiniMax");
  }
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
    return await callMiniMax(
      SYSTEM_PROMPT,
      `Generate a detailed mind map for: "${topic}". Make every node specific and unique.`
    );
  } catch (err) {
    console.warn("Fallback triggered (generateMindMap):", err);
    return getFallback(topic);
  }
}

// ✨ Expand node dynamically
export async function expandNode(label: string): Promise<MindMapNode> {
  try {
    return await callMiniMax(
      EXPAND_PROMPT,
      `Expand this mind map node with deep, specific subtopics: "${label}"`
    );
  } catch (err) {
    console.warn("Fallback triggered (expandNode):", err);
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

// 🔁 Backup if API fails
function getFallback(topic: string): MindMapNode {
  return {
    label: topic,
    subtopics: [
      {
        label: 'Core Concepts',
        subtopics: [
          { label: 'Fundamentals' },
          { label: 'Key Principles' }
        ]
      },
      {
        label: 'Applications',
        subtopics: [
          { label: 'Real-world Use' },
          { label: 'Case Studies' }
        ]
      },
      {
        label: 'Tools & Methods',
        subtopics: [
          { label: 'Popular Tools' },
          { label: 'Best Practices' }
        ]
      },
      {
        label: 'Future Trends',
        subtopics: [
          { label: 'Emerging Ideas' },
          { label: 'Research Areas' }
        ]
      }
    ]
  };
}
