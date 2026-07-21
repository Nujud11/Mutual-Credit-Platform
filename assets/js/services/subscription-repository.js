import {
    db,
  } from "../../../firebase/firebase-config.js";
  
  import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    runTransaction,
    where,
  } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
  
  
  const allowedPlans = [
    "basic",
    "professional",
    "enterprise",
  ];
  
  
  export async function getCompanySubscriptionRequests(
    companyId,
  ) {
    if (!companyId) {
      throw new Error(
        "company-id-required",
      );
    }
  
    const companyRequestsQuery =
      query(
        collection(
          db,
          "subscriptionRequests",
        ),
  
        where(
          "companyId",
          "==",
          companyId,
        ),
      );
  
    const requestsSnapshot =
      await getDocs(
        companyRequestsQuery,
      );
  
    return requestsSnapshot.docs
      .map(
        (requestDocument) => ({
          id: requestDocument.id,
          ...requestDocument.data(),
        }),
      )
      .sort(
        (
          firstRequest,
          secondRequest,
        ) => {
          const firstDate =
            getDateTimestamp(
              firstRequest.createdAt,
            );
  
          const secondDate =
            getDateTimestamp(
              secondRequest.createdAt,
            );
  
          return secondDate - firstDate;
        },
      );
  }
  
  
  export async function getPendingSubscriptionRequest(
    companyId,
  ) {
    const requests =
      await getCompanySubscriptionRequests(
        companyId,
      );
  
    return (
      requests.find(
        (request) =>
          request.status === "pending",
      )
      ?? null
    );
  }
  
  
  export async function createSubscriptionRequest({
    companyId,
    companyName,
    currentPlan,
    requestedPlan,
  }) {
    validateSubscriptionRequest({
      companyId,
      currentPlan,
      requestedPlan,
    });
  
    const pendingRequest =
      await getPendingSubscriptionRequest(
        companyId,
      );
  
    if (pendingRequest) {
      throw new Error(
        "pending-request-exists",
      );
    }
  
    const normalizedCurrentPlan =
      normalizePlan(
        currentPlan,
      );
  
    const requestData = {
      companyId,
  
      companyName:
        String(
          companyName
          ?? "منشأة بدون اسم",
        ).trim(),
  
      currentPlan:
        normalizedCurrentPlan,
  
      requestedPlan,
  
      status: "pending",
  
      createdAt:
        new Date().toISOString(),
  
      updatedAt:
        new Date().toISOString(),
  
      reviewedAt: null,
  
      rejectionReason: null,
    };
  
    const requestReference =
      await addDoc(
        collection(
          db,
          "subscriptionRequests",
        ),
        requestData,
      );
  
    return {
      id: requestReference.id,
      ...requestData,
    };
  }

  export async function getAllSubscriptionRequests() {
    const requestsSnapshot =
      await getDocs(
        collection(
          db,
          "subscriptionRequests",
        ),
      );
  
    return requestsSnapshot.docs
      .map(
        (requestDocument) => ({
          id: requestDocument.id,
          ...requestDocument.data(),
        }),
      )
      .sort(
        (
          firstRequest,
          secondRequest,
        ) => {
          const firstDate =
            getDateTimestamp(
              firstRequest.createdAt,
            );
  
          const secondDate =
            getDateTimestamp(
              secondRequest.createdAt,
            );
  
          return secondDate - firstDate;
        },
      );
  }

  export async function approveSubscriptionRequest(
    requestId,
  ) {
    if (!requestId) {
      throw new Error(
        "subscription-request-id-required",
      );
    }
  
    const requestReference =
      doc(
        db,
        "subscriptionRequests",
        requestId,
      );
  
    await runTransaction(
      db,
      async (transaction) => {
        const requestSnapshot =
          await transaction.get(
            requestReference,
          );
  
        if (!requestSnapshot.exists()) {
          throw new Error(
            "subscription-request-not-found",
          );
        }
  
        const requestData =
          requestSnapshot.data();
  
        if (
          requestData.status
          !== "pending"
        ) {
          throw new Error(
            "subscription-request-already-reviewed",
          );
        }
  
        if (
          !allowedPlans.includes(
            requestData.requestedPlan,
          )
        ) {
          throw new Error(
            "invalid-requested-plan",
          );
        }
  
        if (!requestData.companyId) {
          throw new Error(
            "company-id-required",
          );
        }
  
        const companyReference =
          doc(
            db,
            "companies",
            requestData.companyId,
          );
  
        const companySnapshot =
          await transaction.get(
            companyReference,
          );
  
        if (!companySnapshot.exists()) {
          throw new Error(
            "company-not-found",
          );
        }
  
        const now =
          new Date().toISOString();
  
        transaction.update(
          companyReference,
          {
            subscriptionPlan:
              requestData.requestedPlan,
  
            subscriptionStatus:
              "active",
  
            subscriptionStart:
              now,
  
            subscriptionEnd:
              null,
  
            subscriptionUpdatedAt:
              now,
          },
        );
  
        transaction.update(
          requestReference,
          {
            status:
              "approved",
  
            reviewedAt:
              now,
  
            updatedAt:
              now,
  
            rejectionReason:
              null,
          },
        );
      },
    );
  
    return {
      success: true,
    };
  }


  export async function rejectSubscriptionRequest(
    requestId,
    rejectionReason = "",
  ) {
    if (!requestId) {
      throw new Error(
        "subscription-request-id-required",
      );
    }
  
    const requestReference =
      doc(
        db,
        "subscriptionRequests",
        requestId,
      );
  
    await runTransaction(
      db,
      async (transaction) => {
        const requestSnapshot =
          await transaction.get(
            requestReference,
          );
  
        if (!requestSnapshot.exists()) {
          throw new Error(
            "subscription-request-not-found",
          );
        }
  
        const requestData =
          requestSnapshot.data();
  
        if (
          requestData.status
          !== "pending"
        ) {
          throw new Error(
            "subscription-request-already-reviewed",
          );
        }
  
        const now =
          new Date().toISOString();
  
        transaction.update(
          requestReference,
          {
            status:
              "rejected",
  
            reviewedAt:
              now,
  
            updatedAt:
              now,
  
            rejectionReason:
              String(
                rejectionReason
                ?? "",
              ).trim(),
          },
        );
      },
    );
  
    return {
      success: true,
    };
  }
  
  
  function validateSubscriptionRequest({
    companyId,
    currentPlan,
    requestedPlan,
  }) {
    if (!companyId) {
      throw new Error(
        "company-id-required",
      );
    }
  
    if (
      !allowedPlans.includes(
        requestedPlan,
      )
    ) {
      throw new Error(
        "invalid-requested-plan",
      );
    }
  
    const normalizedCurrentPlan =
      normalizePlan(
        currentPlan,
      );
  
    if (
      normalizedCurrentPlan
      === requestedPlan
    ) {
      throw new Error(
        "same-subscription-plan",
      );
    }
  }
  
  
  function normalizePlan(
    plan,
  ) {
    return allowedPlans.includes(plan)
      ? plan
      : "basic";
  }
  
  
  function getDateTimestamp(
    dateValue,
  ) {
    if (!dateValue) {
      return 0;
    }
  
    if (
      typeof dateValue?.toDate
      === "function"
    ) {
      return dateValue
        .toDate()
        .getTime();
    }
  
    const parsedDate =
      new Date(
        dateValue,
      );
  
    return Number.isNaN(
      parsedDate.getTime(),
    )
      ? 0
      : parsedDate.getTime();
  }