import {
    auth,
    db,
  } from "../../../firebase/firebase-config.js";
  
  import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
  } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
  
  import {
    doc,
    getDoc,
    setDoc,
  } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
  
  
  export async function createCompanyAccount(
    companyData,
  ) {
    const normalizedEmail =
      companyData.email
        .trim()
        .toLowerCase();
  
    const isVerified =
      Boolean(
        companyData.isCommercialRecordVerified,
      );
  
    const initialTrustScore =
      isVerified ? 60 : 40;
  
    const initialCreditLimit =
      isVerified ? 500 : 300;
  
    const initialRiskLevel =
      isVerified
        ? "قيد التقييم - بداية موثوقة"
        : "قيد التقييم";
  
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        companyData.password,
      );
  
    const firebaseUser =
      userCredential.user;
  
    const companyProfile = {
      id: firebaseUser.uid,
  
      companyName:
        companyData.companyName.trim(),
  
      businessType:
        companyData.businessType,
  
      city:
        companyData.city.trim(),
  
      companyAge:
        Number(companyData.companyAge) || 0,
  
      description:
        companyData.description.trim(),
  
      email:
        normalizedEmail,
  
      isCommercialRecordVerified:
        isVerified,

      role: "company",

      accountStatus: "pending",
      
      subscriptionPlan: "starter",
      
      subscriptionStatus: "inactive",
      
      subscriptionStart: null,
      
      subscriptionEnd: null,
  
      balance: 0,
  
      creditLimit:
        initialCreditLimit,
  
      trustScore:
        initialTrustScore,
  
      riskLevel:
        initialRiskLevel,
  
      createdAt:
        new Date().toISOString(),
    };
  
    await setDoc(
      doc(
        db,
        "companies",
        firebaseUser.uid,
      ),
      companyProfile,
    );
  
    return companyProfile;
  }
  
  
  export async function loginCompany(
    email,
    password,
  ) {
    const normalizedEmail =
      email
        .trim()
        .toLowerCase();
  
    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password,
      );
  
    const firebaseUser =
      userCredential.user;
  
    const companyDocument =
      await getDoc(
        doc(
          db,
          "companies",
          firebaseUser.uid,
        ),
      );
  
    if (!companyDocument.exists()) {
      throw new Error(
        "company-profile-not-found",
      );
    }
  
    return {
      id: firebaseUser.uid,
      ...companyDocument.data(),
    };
  }
  
  export async function getCompanyProfile(
    companyId,
  ) {
    const companyDocument =
      await getDoc(
        doc(
          db,
          "companies",
          companyId,
        ),
      );
  
    if (!companyDocument.exists()) {
      throw new Error(
        "company-profile-not-found",
      );
    }
  
    return {
      id: companyDocument.id,
      ...companyDocument.data(),
    };
  }
  
  export async function logoutCompany() {
    await signOut(auth);
  }