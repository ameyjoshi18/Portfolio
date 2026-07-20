"use client";

import { Component, type ReactNode } from "react";

type CutoverErrorBoundaryProps = {
  children: ReactNode;
  onError: () => void;
};

type CutoverErrorBoundaryState = {
  failed: boolean;
};

export class CutoverErrorBoundary extends Component<
  CutoverErrorBoundaryProps,
  CutoverErrorBoundaryState
> {
  state: CutoverErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): CutoverErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
