import {
    db,
} from "../../../firebase/firebase-config.js";

import {
    askGemini,
} from "./gemini-service.js";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    setDoc,
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const COMPANIES_COLLECTION =
    "companies";

const SERVICES_COLLECTION =
    "services";

const RECOMMENDATION_ANALYSES_COLLECTION =
    "recommendationAnalyses";

const GEMINI_MODEL =
    "gemini-3.1-flash-lite";


export async function getSavedSmartRecommendations(
    companyId,
) {
    if (!companyId) {
        return null;
    }

    const analysisReference =
        doc(
            db,
            RECOMMENDATION_ANALYSES_COLLECTION,
            companyId,
        );

    const analysisSnapshot =
        await getDoc(
            analysisReference,
        );

    if (!analysisSnapshot.exists()) {
        return null;
    }

    const analysisData =
        analysisSnapshot.data();

    return {
        companyId:
            analysisData.companyId,

        analysis:
            analysisData.analysis ?? "",

        recommendations:
            Array.isArray(
                analysisData.recommendations,
            )
                ? analysisData.recommendations
                : [],

        generatedAt:
            analysisData.generatedAt ?? null,

        model:
            analysisData.model
            ?? GEMINI_MODEL,
    };
}


export async function generateAndSaveSmartRecommendations(
    currentCompany,
) {
    const generatedResult =
        await generateSmartRecommendations(
            currentCompany,
        );

    const analysisReference =
        doc(
            db,
            RECOMMENDATION_ANALYSES_COLLECTION,
            currentCompany.id,
        );

    await setDoc(
        analysisReference,
        {
            companyId:
                currentCompany.id,

            companyName:
                currentCompany.companyName,

            analysis:
                generatedResult.analysis,

            recommendations:
                generatedResult.recommendations,

            generatedAt:
                serverTimestamp(),

            model:
                GEMINI_MODEL,
        },
    );

    const savedSnapshot =
        await getDoc(
            analysisReference,
        );

    if (!savedSnapshot.exists()) {
        return {
            ...generatedResult,
            generatedAt:
                new Date(),
        };
    }

    const savedData =
        savedSnapshot.data();

    return {
        analysis:
            savedData.analysis
            ?? generatedResult.analysis,

        recommendations:
            Array.isArray(
                savedData.recommendations,
            )
                ? savedData.recommendations
                : generatedResult.recommendations,

        generatedAt:
            savedData.generatedAt
            ?? new Date(),

        model:
            savedData.model
            ?? GEMINI_MODEL,
    };
}


export async function generateSmartRecommendations(
    currentCompany,
) {
    if (!currentCompany?.id) {
        throw new Error(
            "current-company-not-found",
        );
    }

    const [
        companies,
        services,
    ] = await Promise.all([
        getAllCompanies(),
        getAllActiveServices(),
    ]);

    const candidateCompanies =
        buildCandidateCompanies({
            companies,
            services,
            currentCompanyId:
                currentCompany.id,
        });

    if (!candidateCompanies.length) {
        return {
            analysis:
                "لا توجد شركات أخرى لديها خدمات نشطة حاليًا.",
            recommendations: [],
        };
    }

    const prompt =
        buildRecommendationPrompt({
            currentCompany,
            candidateCompanies,
        });

    const geminiResponse =
        await askGemini(prompt);

    const parsedResponse =
        parseGeminiJson(
            geminiResponse,
        );

    return validateRecommendations({
        aiResult:
            parsedResponse,

        candidateCompanies,
    });
}


async function getAllCompanies() {
    const querySnapshot =
        await getDocs(
            collection(
                db,
                COMPANIES_COLLECTION,
            ),
        );

    return querySnapshot.docs.map(
        (companyDocument) => ({
            id:
                companyDocument.id,

            ...companyDocument.data(),
        }),
    );
}


async function getAllActiveServices() {
    const querySnapshot =
        await getDocs(
            collection(
                db,
                SERVICES_COLLECTION,
            ),
        );

    return querySnapshot.docs
        .map(
            (serviceDocument) => ({
                id:
                    serviceDocument.id,

                ...serviceDocument.data(),
            }),
        )
        .filter(
            (service) =>
                service.status === "active",
        );
}


function buildCandidateCompanies({
    companies,
    services,
    currentCompanyId,
}) {
    return companies
        .filter(
            (company) =>
                company.id !== currentCompanyId,
        )
        .map(
            (company) => {
                const companyServices =
                    services
                        .filter(
                            (service) =>
                                service.companyId
                                === company.id,
                        )
                        .map(
                            (service) => ({
                                id:
                                    service.id,

                                title:
                                    service.title,

                                category:
                                    service.category,

                                description:
                                    service.description,

                                price:
                                    Number(
                                        service.price,
                                    ) || 0,
                            }),
                        );

                return {
                    id:
                        company.id,

                    companyName:
                        company.companyName,

                    businessType:
                        company.businessType,

                    city:
                        company.city,

                    description:
                        company.description,

                    trustScore:
                        Number(
                            company.trustScore,
                        ) || 0,

                    riskLevel:
                        company.riskLevel
                        ?? "غير محدد",

                    services:
                        companyServices,
                };
            },
        )
        .filter(
            (company) =>
                company.services.length > 0,
        );
}


function buildRecommendationPrompt({
    currentCompany,
    candidateCompanies,
}) {
    const currentCompanyData = {
        id:
            currentCompany.id,

        companyName:
            currentCompany.companyName,

        businessType:
            currentCompany.businessType,

        city:
            currentCompany.city,

        description:
            currentCompany.description,

        balance:
            Number(
                currentCompany.balance,
            ) || 0,

        creditLimit:
            Number(
                currentCompany.creditLimit,
            ) || 0,

        trustScore:
            Number(
                currentCompany.trustScore,
            ) || 0,

        riskLevel:
            currentCompany.riskLevel
            ?? "غير محدد",
    };

    return `
  أنت مستشار أعمال ومحرك توصيات ذكي داخل منصة مقاصة للائتمان المتبادل بين المنشآت.
  
  حلل احتياجات الشركة الحالية، ثم اختر أفضل ثلاث فرص تعاون من الشركات والخدمات المتاحة.
  
  بيانات الشركة الحالية:
  ${JSON.stringify(
        currentCompanyData,
        null,
        2,
    )}
  
  الشركات والخدمات المرشحة:
  ${JSON.stringify(
        candidateCompanies,
        null,
        2,
    )}
  
  قواعد مهمة:
  1. لا ترشح الشركة الحالية لنفسها.
  2. اختر فقط شركات وخدمات موجودة في البيانات المرسلة.
  3. لا تختر شركة لا تحتوي على خدمات.
  4. اعتمد على معنى النشاط والوصف والخدمات، وليس على تطابق الكلمات فقط.
  5. أعطِ الأولوية للخدمات التي تحل احتياجًا تجاريًا منطقيًا للشركة الحالية.
  6. استخدم معرفات الشركة والخدمة كما هي حرفيًا.
  7. اجعل درجة الملاءمة بين 0 و100.
  8. اكتب الأسباب باللغة العربية وبشكل واضح ومختصر.
  9. أعد JSON فقط دون Markdown أو شرح خارجي.
  
  صيغة الإجابة المطلوبة:
  
  {
    "analysis": "تحليل مختصر لوضع الشركة واحتياجاتها المحتملة",
    "recommendations": [
      {
        "companyId": "معرف الشركة",
        "companyName": "اسم الشركة",
        "serviceId": "معرف الخدمة",
        "serviceName": "اسم الخدمة",
        "score": 90,
        "reason": "سبب ترشيح هذه الخدمة للشركة الحالية"
      }
    ]
  }
  `;
}


function parseGeminiJson(
    responseText,
) {
    const cleanedText =
        responseText
            .replace(
                /```json/gi,
                "",
            )
            .replace(
                /```/g,
                "",
            )
            .trim();

    try {
        return JSON.parse(
            cleanedText,
        );

    } catch (error) {
        console.error(
            "Gemini raw response:",
            responseText,
        );

        throw new Error(
            "invalid-gemini-json",
        );
    }
}


function validateRecommendations({
    aiResult,
    candidateCompanies,
}) {
    const companyMap =
        new Map(
            candidateCompanies.map(
                (company) => [
                    company.id,
                    company,
                ],
            ),
        );

    const validRecommendations =
        (
            Array.isArray(
                aiResult?.recommendations,
            )
                ? aiResult.recommendations
                : []
        )
            .map(
                (recommendation) => {
                    const company =
                        companyMap.get(
                            recommendation.companyId,
                        );

                    if (!company) {
                        return null;
                    }

                    const service =
                        company.services.find(
                            (companyService) =>
                                companyService.id
                                === recommendation.serviceId,
                        );

                    if (!service) {
                        return null;
                    }

                    return {
                        companyId:
                            company.id,

                        companyName:
                            company.companyName,

                        businessType:
                            company.businessType,

                        city:
                            company.city,

                        trustScore:
                            company.trustScore,

                        riskLevel:
                            company.riskLevel,

                        serviceId:
                            service.id,

                        serviceName:
                            service.title,

                        serviceCategory:
                            service.category,

                        serviceDescription:
                            service.description,

                        servicePrice:
                            service.price,

                        score:
                            normalizeScore(
                                recommendation.score,
                            ),

                        reason:
                            String(
                                recommendation.reason
                                ?? "توجد فرصة تعاون محتملة بين الشركتين.",
                            ).trim(),
                    };
                },
            )
            .filter(Boolean)
            .sort(
                (
                    firstRecommendation,
                    secondRecommendation,
                ) =>
                    secondRecommendation.score
                    - firstRecommendation.score,
            )
            .slice(0, 3);

    return {
        analysis:
            String(
                aiResult?.analysis
                ?? "تم تحليل الخدمات المتاحة داخل الشبكة.",
            ).trim(),

        recommendations:
            validRecommendations,
    };
}


function normalizeScore(
    score,
) {
    const numericScore =
        Number(score);

    if (
        !Number.isFinite(
            numericScore,
        )
    ) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(
            0,
            Math.round(
                numericScore,
            ),
        ),
    );
}