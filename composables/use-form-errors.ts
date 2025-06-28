import type {ZodIssue, SafeParseReturnType} from "zod";

export const useFormErrors = () => {

  const errors = reactive([] as
    { path: string;   code: string;   message: string; }[]
  );

  function initErrors() {
    errors.splice(0, Infinity);
  }

  function setError(paths: (string|number)[], code: string, message: string): void {
    const path = paths.join('.')
    errors.push({ path, code, message });
  }

  function setErrors(issues: ZodIssue[]) {
    initErrors();
    for (const issue of issues) {
      setError(issue.path, issue.code, issue.message);
    }
  }

  function hasError(path: string, code?: string): boolean {
    return errors.some(err => (err.path === path && (! code || err.code === code)));
  }

  function clearErrors(path: string) {

    if (errors.length) {
      const idxes = errors.map((err, idx) => {
        if (err.path === path) {
          return idx;
        }
      }).filter(idx => typeof idx !== 'undefined') as number[];
      idxes.reverse().forEach((idx) => {
        errors.splice(idx, 1);
      })
    }
  }

  function validate<Input, Output>(
    document: Input,
    isDocument: <Input>(data:any) => data is Input,
    parseDocument: <Input>(data: any) => SafeParseReturnType<Input, Output>
  ) {
    if (!isDocument(document)) {
      const parseResult = parseDocument(document);
      if (parseResult?.error?.issues && parseResult?.error?.issues?.length > 0) {
        const issues = parseResult?.error?.issues || [];
        if (issues?.length > 0) {
          setErrors(issues);
        }
      }
      return false;
    }
    return true;
  }


  return { errors, hasError, clearErrors, validate }
}