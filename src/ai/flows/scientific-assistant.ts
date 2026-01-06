"use server";
/**
 * @fileOverview A comprehensive scientific assistant AI flow.
 *
 * This flow acts as a versatile assistant that can chat, perform mathematical
 * operations, and interact with the user's notes and equation library.
 * It uses tools to add new equations or notes on behalf of the user.
 *
 * It exports:
 * - `scientificAssistant`: The main flow function.
 * - `ScientificAssistantInput`: The input type for the flow.
 * - `ScientificAssistantOutput`: The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { EquationSchema, NoteSchema } from '@/lib/types';
import { evaluate } from 'mathjs';

// Tool: Add a new note
const addNoteTool = ai.defineTool(
    {
        name: 'addNote',
        description: 'Adds a new note to the user\'s notebook. Use this when the user explicitly asks to create a note, reminder, or summary.',
        inputSchema: z.object({
            title: z.string().describe("The title of the note."),
            content: z.string().describe("The Markdown content of the note."),
        }),
        outputSchema: z.string(),
    },
    async ({ title, content }) => {
        // In a real app, this would save to a database.
        // Here, we just confirm what was "saved".
        return `Note titled "${title}" was successfully created.`;
    }
);


// Tool: Add a new equation
const addEquationTool = ai.defineTool(
    {
        name: 'addEquation',
        description: 'Adds a new equation to the user\'s equation library. Use this when the user provides a new equation and asks to save it.',
        inputSchema: z.object({
            name: z.string().describe("The descriptive name of the equation."),
            latex: z.string().describe("The LaTeX code for the equation."),
        }),
        outputSchema: z.string(),
    },
    async ({ name, latex }) => {
        return `Equation named "${name}" with LaTeX "${latex}" was successfully added to the library.`;
    }
);

// Tool: Perform Calculus and Symbolic Math
const calculusTool = ai.defineTool(
    {
        name: 'calculusTool',
        description: 'Performs calculus operations like derivation, integration, or simplification on a mathematical expression.',
        inputSchema: z.object({
            operation: z.enum(['derive', 'integrate', 'simplify']).describe('The operation to perform.'),
            expression: z.string().describe('The mathematical expression to operate on.'),
        }),
        outputSchema: z.string().describe("The result of the operation in LaTeX format."),
    },
    async ({ operation, expression }) => {
        // This is a placeholder. A real implementation would use a library like `mathjs`
        // with its symbolic manipulation features, or another specialized service.
        // For now, we'll just acknowledge the request and ask the LLM to provide the answer.
        return `The user wants to ${operation} the expression: ${expression}. Please provide the resulting mathematical expression in your response, formatted in LaTeX.`;
    }
);


const ScientificAssistantInputSchema = z.object({
    chatHistory: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
    })).describe("The history of the conversation so far."),
    request: z.string().describe("The user's latest request or question."),
    equations: z.array(EquationSchema).optional().describe("The user's current list of saved equations."),
    notes: z.array(NoteSchema).optional().describe("The user's current list of saved notes."),
});
export type ScientificAssistantInput = z.infer<typeof ScientificAssistantInputSchema>;

const ScientificAssistantOutputSchema = z.object({
    response: z.string().describe("The assistant's response to the user."),
    toolResponse: z.object({
        tool: z.string(),
        data: z.any(),
    }).optional().describe("Information about any tool action taken."),
});
export type ScientificAssistantOutput = z.infer<typeof ScientificAssistantOutputSchema>;


const systemPrompt = `You are "المساعد العلمي" (The Scientific Assistant), an expert AI integrated into the "Equation Note" application. Your personality is professional, knowledgeable, and helpful. You communicate in Arabic.

You have the following capabilities:
1.  **General Knowledge:** You can answer questions on a wide range of scientific and mathematical topics.
2.  **Calculus & Algebra:** You can perform operations like derivation, integration, and simplification using the 'calculusTool'. When a user asks to perform such an operation, you MUST use this tool.
3.  **Context Awareness:** You have access to the user's saved equations and notes. You can answer questions about them or use them in your reasoning.
4.  **Application Integration:** You can add new notes or equations to the user's library using the 'addNote' and 'addEquation' tools. Use these tools ONLY when the user explicitly asks to save or create something.

**Your Goal:** To be an indispensable assistant for students and professionals, providing accurate information and seamless integration with their workflow within the app.

**Conversation History:**
{{#each chatHistory}}
- {{role}}: {{{content}}}
{{/each}}

**User's Saved Equations:**
{{#if equations}}
{{#each equations}}
- {{name}}: \`{{latex}}\`
{{/each}}
{{else}}
- No equations saved yet.
{{/if}}

**User's Saved Notes:**
{{#if notes}}
{{#each notes}}
- Title: {{title}}
{{/each}}
{{else}}
- No notes saved yet.
{{/if}}`;


export const scientificAssistant = ai.defineFlow(
    {
        name: 'scientificAssistantFlow',
        inputSchema: ScientificAssistantInputSchema,
        outputSchema: ScientificAssistantOutputSchema,
    },
    async (input) => {
        const { request, chatHistory, equations, notes } = input;

        const llmResponse = await ai.generate({
            model: 'googleai/gemini-2.5-flash',
            prompt: {
                text: request,
                context: [{ role: 'user', content: request }], // Simplified context for prompt
            },
            system: systemPrompt,
            context: chatHistory,
            tools: [addNoteTool, addEquationTool, calculusTool],
            templateData: {
                chatHistory: chatHistory,
                equations: equations,
                notes: notes,
            }
        });

        const textResponse = llmResponse.text;
        const toolCalls = llmResponse.toolCalls;

        if (toolCalls && toolCalls.length > 0) {
            const toolCall = toolCalls[0];
            const tool = toolCall.tool;
            const toolInput = toolCall.input;

            const toolResult = await tool(toolInput);
            
            // Generate a final response that incorporates the tool's output
            const finalResponse = await ai.generate({
                prompt: {
                    text: `Tool action completed. Acknowledge the result and continue the conversation naturally. Tool result: ${toolResult}`,
                    context: [
                        ...chatHistory,
                        { role: 'user', content: request },
                        { role: 'assistant', content: textResponse }, // The LLM's initial thought process
                        { role: 'tool', content: toolResult, tool: toolCall.tool.name },
                    ],
                },
                system: systemPrompt,
                templateData: {
                    chatHistory: chatHistory,
                    equations: equations,
                    notes: notes,
                }
            });

            return {
                response: finalResponse.text,
                toolResponse: {
                    tool: tool.name,
                    data: toolInput,
                }
            };
        }

        return { response: textResponse };
    }
);
