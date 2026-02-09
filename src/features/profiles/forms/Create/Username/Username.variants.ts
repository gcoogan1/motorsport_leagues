type UsernameContent = {
  question: string;
  label: string;
  helperMsg?: string;
  inputHelpMsg?: string;
}

export const USERNAME_VARIANTS: Record<string, UsernameContent> = {
  gt7: {
    question: "What is your username on GT7?",
    label: "GT7 Nickname",
    inputHelpMsg: "This is the Nickname that you use on Gran Turismo 7, not your Playstation Network (PSN) ID.",
  },
};
