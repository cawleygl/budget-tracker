export class Controller {
  static parseIDFromParams(paramsId: string | string[] | undefined): string {
      return (paramsId && Array.isArray(paramsId)
        ? paramsId[0]
        : paramsId) ?? "";
  }
}