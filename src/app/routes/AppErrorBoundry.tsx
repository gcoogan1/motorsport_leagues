import { Component, type ReactNode } from "react";
import ErrorPageNoLayout from "@/pages/ErrorPage/ErrorPageNoLayout";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("App crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPageNoLayout />;
    }
    return this.props.children;
  }
}
