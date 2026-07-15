export function formatNumber(value) {
    const numericValue =
      Number(value) || 0;
  
    return numericValue.toLocaleString(
      "ar-SA",
    );
  }
  
  
  export function formatCreditBalance(value) {
    const numericValue =
      Number(value) || 0;
  
    const sign =
      numericValue > 0 ? "+" : "";
  
    return `${sign}${formatNumber(
      numericValue,
    )} وحدة`;
  }
  
  
  export function formatPercentage(value) {
    const numericValue =
      Number(value) || 0;
  
    return `${formatNumber(
      numericValue,
    )}%`;
  }
  
  
  export function formatVerificationStatus(
    isVerified,
  ) {
    return isVerified
      ? "موثق"
      : "غير موثق";
  }

  export function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }