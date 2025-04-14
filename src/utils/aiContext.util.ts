export const getAiContext = () => {
  const aiContext = localStorage.getItem("aiContext");
  return aiContext ? JSON.parse(aiContext) : [];
};

export const setAiContext = (aiContext: any) => {
  localStorage.setItem("aiContext", JSON.stringify(aiContext));
};
