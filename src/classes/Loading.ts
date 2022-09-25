/**
 * @Author Likan
 * @Date 2022-09-18 11:32:27
 * @Filepath src/classes/Loading.ts
 * @Description
 */

interface LoadingState extends vscode.Disposable {
  exist: boolean;
}

class Loading {
  private static loadingStack: Array<LoadingState> = [];

  private static pushLoading(title: string) {
    const loading = vscode.window.setStatusBarMessage(`$(loading~spin) ${title}`);

    this.loadingStack.push(Object.assign(loading, { exist: true }));
  }

  public static disposeLastOne() {
    for (const loading of this.loadingStack) {
      loading?.dispose?.();
    }

    this.loadingStack.at(-1)?.dispose();
  }

  public static createLoading(title: string, duration?: number) {
    this.pushLoading(title);

    if (duration !== undefined) {
      setTimeout(() => {
        this.disposeLastOne();
      }, duration);
    }
  }
}

export default Loading;
