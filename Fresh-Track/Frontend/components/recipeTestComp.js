// Aidan's code that he sent me that I am editing to work within our project and my front end
import * as ImagePicker from 'expo-image-picker';
import OpenAI from 'openai';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet
} from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";

const openai = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
});

const ingredients = [
    { name: "chicken breast", expiryDate: "22-04-2026" },
    { name: "minced beef", expiryDate: "23-04-2026" },
    { name: "salmon fillet", expiryDate: "24-04-2026" },

    { name: "milk", expiryDate: "22-04-2026" },
    { name: "cheddar cheese", expiryDate: "28-04-2026" },
    { name: "double cream", expiryDate: "25-04-2026" },

    { name: "pasta", expiryDate: "01-06-2026" },
    { name: "rice", expiryDate: "10-07-2026" },
    { name: "bread", expiryDate: "21-04-2026" },

    { name: "spinach", expiryDate: "22-04-2026" },
    { name: "broccoli", expiryDate: "23-04-2026" },
    { name: "bell pepper", expiryDate: "24-04-2026" },

    { name: "eggs", expiryDate: "02-05-2026" },
    { name: "butter", expiryDate: "10-05-2026" }
];

function formatDateDDMMYYYY(date = new Date()) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
}

function safeParseJson(text) {
    try {
        return JSON.parse(text);
    } catch {
        const cleaned = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
    }
}

const currentDate = formatDateDDMMYYYY();

const recipeCount = 3;

const PROMPT =

    `You are a professional Chef making recipe suggestions for users
    You will be given a list of ingredients, each has a expiry date.
    Your goal is to make ${recipeCount} recipes
    The current date is ${currentDate}
    - You must prioritise the ingredients with the shortest time on their expiry date left 
    - Use as many ingredients that are expirying in each recipe as possible
    - Create simple recipes that don't use any crazy ingredients that the user is unlikely to have

    Rules:
    - Prioritise the ingredients the user already has
    - Prioriste ingredients that are expiring soon
    - You may use ingredients the user doesn't have but this should be reduces as much as possible
    - Ingredients in recpies thsat the user dont have should be commonly found in the houshold - do not use rare/specific or hard to find ingredients if the user doen't have them
    - The recipes should have a good variety
    - Do not re use the primary ingredients across the recipes unless necessary or the amount of ingredients is stated/repeated multiple times
    - You may re use supporting ingredients e.g butter,spices etc
    - Ensure each recpie is different form the others
    - Use famous/reputable sources for recipes
    - Ensure instructions are clear and make sense 
    - Rank each recipe 0 - 10 based on its ability to use the maximum amount of expiring products
    - 10 being uses all products that are expiring soon, 0 is none

    Return ONLY valid JSON in this exact structure:

    {
    "recipes": [
        {
        "name": "string",
        "priorityScore": number (0-10 based on how well it uses soon-expiring ingredients),
        "ingredientsUsed": [
            {
            "name": "string",
            "amount": "string",
            "expiryDate": "YYYY-MM-DD"
            }
        ],
        "missingIngredients": [
            {
            "name": "string",
            "amount": "string"
            }
        ],
        "steps": ["string"],
        "estimatedTime": "string"
        }
    ]
    }

    Ingredients:
    ${JSON.stringify(ingredients)}

    `;

const getRecipe = async () => {

    try {
        const result = await openai.chat.completions.create({
            model: 'gpt-4o',
            temperature: 0,
            max_tokens: 1000,
            messages: [
                {
                    role: 'user',
                    content: PROMPT,
                },
            ],
        });


        const parsedRecipes = JSON.parse(result.choices[0].message.content);
        console.log(parsedRecipes)

    } catch (err) {
        Alert.alert('Error', 'Could not generate recipe');
        console.error(err);

    };

    return

}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        marginTop: 30
    },
    title: {
        fontSize: RFValue(24),
        fontFamily: 'Inter_600SemiBold',
        marginBottom: 10,
    },
    uploadArea: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#bbb',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: '#F8F5EC',
        minHeight: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    preview: {
        width: '100%',
        height: 240,
        resizeMode: 'cover',
    },
    placeholder: {
        alignItems: 'center',
        padding: 40,
    },
    cameraIcon: {
        fontSize: 36,
        marginBottom: 12,
    },
    placeholderText: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
    },
    btn: {
        backgroundColor: '#111',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    btnDisabled: {
        backgroundColor: '#555',
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    jsonContainer: {
        marginTop: 4,
    },
    jsonLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#888',
        letterSpacing: 0.8,
        marginBottom: 8,
    },
    jsonBox: {
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        padding: 16,
    },
    jsonText: {
        fontFamily: 'monospace',
        fontSize: 12,
        color: '#d4d4d4',
        lineHeight: 20,
    },
});