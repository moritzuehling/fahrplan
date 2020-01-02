interface NodeModule {
  hot: {
    accept: (module: string, reactToReload: () => any) => void;
  }
}