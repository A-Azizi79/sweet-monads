import type { Monad, Alternative } from "@sweet-monads/interfaces";

const enum ResultType {
  Initial = "Initial",
  Pending = "Pending",
  Success = "Success",
  Failure = "Failure"
}

function isWrappedFunction<A, B, L>(m: Result<L, A> | Result<L, (a: A) => B>): m is Result<L, (a: A) => B> {
  return !m.isInitial() && !m.isPending() && typeof m.value === "function";
}

class ResultConstructor<F, S, T extends ResultType = ResultType> implements Monad<S>, Alternative<T> {
  static chain<F, R, NL, NR>(f: (v: R) => Promise<Result<NL, NR>>) {
    return (m: Result<F, R>): Promise<Result<F | NL, NR>> => m.asyncChain(f);
  }

  static mergeInOne<F1, S1>(values: [Result<F1, S1>]): Result<F1, [S1]>;
  static mergeInOne<F1, S1, F2, S2>(values: [Result<F1, S1>, Result<F2, S2>]): Result<F1 | F2, [S1, S2]>;
  static mergeInOne<F1, S1, F2, S2, F3, S3>(
    values: [Result<F1, S1>, Result<F2, S2>, Result<F3, S3>]
  ): Result<F1 | F2 | F3, [S1, S2, S3]>;
  static mergeInOne<F1, S1, F2, S2, F3, S3, F4, S4>(
    values: [Result<F1, S1>, Result<F2, S2>, Result<F3, S3>, Result<F4, S4>]
  ): Result<F1 | F2 | F3 | F4, [S1, S2, S3, S4]>;
  static mergeInOne<F1, S1, F2, S2, F3, S3, F4, S4, F5, S5>(
    values: [Result<F1, S1>, Result<F2, S2>, Result<F3, S3>, Result<F4, S4>, Result<F5, S5>]
  ): Result<F1 | F2 | F3 | F4 | F5, [S1, S2, S3, S4, S5]>;
  static mergeInOne<F1, S1, F2, S2, F3, S3, F4, S4, F5, S5, F6, S6>(
    values: [Result<F1, S1>, Result<F2, S2>, Result<F3, S3>, Result<F4, S4>, Result<F5, S5>, Result<F6, S6>]
  ): Result<F1 | F2 | F3 | F4 | F5 | F6, [S1, S2, S3, S4, S5, S6]>;
  static mergeInOne<F1, S1, F2, S2, F3, S3, F4, S4, F5, S5, F6, S6, F7, S7>(
    values: [
      Result<F1, S1>,
      Result<F2, S2>,
      Result<F3, S3>,
      Result<F4, S4>,
      Result<F5, S5>,
      Result<F6, S6>,
      Result<F7, S7>
    ]
  ): Result<F1 | F2 | F3 | F4 | F5 | F6 | F7, [S1, S2, S3, S4, S5, S6, S7]>;
  static mergeInOne<F1, S1, F2, S2, F3, S3, F4, S4, F5, S5, F6, S6, F7, S7, F8, S8>(
    values: [
      Result<F1, S1>,
      Result<F2, S2>,
      Result<F3, S3>,
      Result<F4, S4>,
      Result<F5, S5>,
      Result<F6, S6>,
      Result<F7, S7>,
      Result<F8, S8>
    ]
  ): Result<F1 | F2 | F3 | F4 | F5 | F6 | F7 | F8, [S1, S2, S3, S4, S5, S6, S7, S8]>;
  static mergeInOne<F1, S1, F2, S2, F3, S3, F4, S4, F5, S5, F6, S6, F7, S7, F8, S8, F9, S9>(
    values: [
      Result<F1, S1>,
      Result<F2, S2>,
      Result<F3, S3>,
      Result<F4, S4>,
      Result<F5, S5>,
      Result<F6, S6>,
      Result<F7, S7>,
      Result<F8, S8>,
      Result<F9, S9>
    ]
  ): Result<F1 | F2 | F3 | F4 | F5 | F6 | F7 | F8 | F9, [S1, S2, S3, S4, S5, S6, S7, S8, S9]>;
  static mergeInOne<F1, S1, F2, S2, F3, S3, F4, S4, F5, S5, F6, S6, F7, S7, F8, S8, F9, S9, F10, S10>(
    values: [
      Result<F1, S1>,
      Result<F2, S2>,
      Result<F3, S3>,
      Result<F4, S4>,
      Result<F5, S5>,
      Result<F6, S6>,
      Result<F7, S7>,
      Result<F8, S8>,
      Result<F9, S9>,
      Result<F10, S10>
    ]
  ): Result<F1 | F2 | F3 | F4 | F5 | F6 | F7 | F8 | F9 | F10, [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10]>;
  static mergeInOne<L, R>(result: Array<Result<L, R>>): Result<L, R[]>;
  static mergeInOne(results: Array<Result<unknown, unknown>>) {
    return results.reduce(
      (acc: Result<unknown, Array<unknown>>, curr) => curr.chain(v => acc.map(arr => arr.concat([v]))),
      ResultConstructor.success<unknown, Array<unknown>>([])
    );
  }

  static merge = ResultConstructor.mergeInOne;

  static mergeInMany<F1, S1>(values: [Result<F1, S1>]): Result<Array<F1>, [S1]>;
  static mergeInMany<F1, S1, F2, S2>(values: [Result<F1, S1>, Result<F2, S2>]): Result<Array<F1 | F2>, [S1, S2]>;
  static mergeInMany<F1, S1, F2, S2, F3, S3>(
    values: [Result<F1, S1>, Result<F2, S2>, Result<F3, S3>]
  ): Result<Array<F1 | F2 | F3>, [S1, S2, S3]>;
  static mergeInMany<F1, S1, F2, S2, F3, S3, F4, S4>(
    values: [Result<F1, S1>, Result<F2, S2>, Result<F3, S3>, Result<F4, S4>]
  ): Result<Array<F1 | F2 | F3 | F4>, [S1, S2, S3, S4]>;
  static mergeInMany<F1, S1, F2, S2, F3, S3, F4, S4, F5, S5>(
    values: [Result<F1, S1>, Result<F2, S2>, Result<F3, S3>, Result<F4, S4>, Result<F5, S5>]
  ): ResultConstructor<Array<F1 | F2 | F3 | F4 | F5>, [S1, S2, S3, S4, S5]>;
  static mergeInMany<F1, S1, F2, S2, F3, S3, F4, S4, F5, S5, F6, S6>(
    values: [Result<F1, S1>, Result<F2, S2>, Result<F3, S3>, Result<F4, S4>, Result<F5, S5>, Result<F6, S6>]
  ): Result<Array<F1 | F2 | F3 | F4 | F5 | F6>, [S1, S2, S3, S4, S5, S6]>;
  static mergeInMany<F1, S1, F2, S2, F3, S3, F4, S4, F5, S5, F6, S6, F7, S7>(
    values: [
      Result<F1, S1>,
      Result<F2, S2>,
      Result<F3, S3>,
      Result<F4, S4>,
      Result<F5, S5>,
      Result<F6, S6>,
      Result<F7, S7>
    ]
  ): Result<Array<F1 | F2 | F3 | F4 | F5 | F6 | F7>, [S1, S2, S3, S4, S5, S6, S7]>;
  static mergeInMany<F1, S1, F2, S2, F3, S3, F4, S4, F5, S5, F6, S6, F7, S7, F8, S8>(
    values: [
      Result<F1, S1>,
      Result<F2, S2>,
      Result<F3, S3>,
      Result<F4, S4>,
      Result<F5, S5>,
      Result<F6, S6>,
      Result<F7, S7>,
      Result<F8, S8>
    ]
  ): ResultConstructor<Array<F1 | F2 | F3 | F4 | F5 | F6 | F7 | F8>, [S1, S2, S3, S4, S5, S6, S7, S8]>;
  static mergeInMany<F1, S1, F2, S2, F3, S3, F4, S4, F5, S5, F6, S6, F7, S7, F8, S8, F9, S9>(
    values: [
      Result<F1, S1>,
      Result<F2, S2>,
      Result<F3, S3>,
      Result<F4, S4>,
      Result<F5, S5>,
      Result<F6, S6>,
      Result<F7, S7>,
      Result<F8, S8>,
      Result<F9, S9>
    ]
  ): Result<Array<F1 | F2 | F3 | F4 | F5 | F6 | F7 | F8 | F9>, [S1, S2, S3, S4, S5, S6, S7, S8, S9]>;
  static mergeInMany<F1, S1, F2, S2, F3, S3, F4, S4, F5, S5, F6, S6, F7, S7, F8, S8, F9, S9, F10, S10>(
    values: [
      Result<F1, S1>,
      Result<F2, S2>,
      Result<F3, S3>,
      Result<F4, S4>,
      Result<F5, S5>,
      Result<F6, S6>,
      Result<F7, S7>,
      Result<F8, S8>,
      Result<F9, S9>,
      Result<F10, S10>
    ]
  ): Result<Array<F1 | F2 | F3 | F4 | F5 | F6 | F7 | F8 | F9 | F10>, [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10]>;
  static mergeInMany<F, S>(Result: Array<Result<F, S>>): Result<F[], S[]>;
  static mergeInMany(results: Array<Result<unknown, unknown>>) {
    return results.reduce((res: ResultConstructor<Array<unknown>, Array<unknown>>, v): ResultConstructor<
      Array<unknown>,
      Array<unknown>
    > => {
      return v.isFailure()
        ? ResultConstructor.failure([v.value])
        : (v.chain(v => res.map(res => [...res, v])) as ResultConstructor<Array<unknown>, Array<unknown>>);
    }, ResultConstructor.success<Array<unknown>, Array<unknown>>([]));
  }

  static from<T>(v: T) {
    return this.success(v);
  }

  static success<F, T>(v: T): Result<F, T> {
    return new ResultConstructor<F, T, ResultType.Success>(ResultType.Success, v);
  }

  static failure<T, R>(v: T): Result<T, R> {
    return new ResultConstructor<T, R, ResultType.Failure>(ResultType.Failure, v);
  }

  static initial<F = undefined, T = unknown>(): Result<F, T> {
    return new ResultConstructor<F, T, ResultType.Initial>(ResultType.Initial, undefined);
  }

  static pending<F = undefined, T = unknown>(): Result<F, T> {
    return new ResultConstructor<F, T, ResultType.Pending>(ResultType.Pending, undefined);
  }

  private constructor(
    private readonly type: T,
    public readonly value: T extends ResultType.Failure ? F : T extends ResultType.Success ? S : undefined
  ) {}

  isFailure(): this is ResultConstructor<F, S, ResultType.Failure> {
    return this.type === ResultType.Failure;
  }

  isSuccess(): this is ResultConstructor<F, S, ResultType.Success> {
    return this.type === ResultType.Success;
  }

  isInitial(): this is ResultConstructor<F, S, ResultType.Initial> {
    return this.type === ResultType.Initial;
  }

  isPending(): this is ResultConstructor<F, S, ResultType.Pending> {
    return this.type === ResultType.Pending;
  }

  join<F1, F2, S>(this: Result<F1, Result<F2, S>>): Result<F1 | F2, S> {
    return this.chain(x => x);
  }

  mapSuccess<T>(f: (r: S) => T): Result<F, T> {
    return this.map(f);
  }

  mapFailure<T>(f: (l: F) => T): Result<T, S> {
    if (this.isFailure()) {
      return ResultConstructor.failure<T, S>(f(this.value as F));
    }
    if (this.isInitial()) {
      return new ResultConstructor<T, S, ResultType.Initial>(ResultType.Initial, undefined);
    }
    if (this.isPending()) {
      return new ResultConstructor<T, S, ResultType.Pending>(ResultType.Pending, undefined);
    }
    return ResultConstructor.success<T, S>(this.value as S);
  }

  map<T>(f: (r: S) => T): Result<F, T> {
    if (this.isInitial()) {
      return ResultConstructor.initial();
    }
    if (this.isPending()) {
      return ResultConstructor.pending();
    }
    if (this.isFailure()) {
      return ResultConstructor.failure<F, T>(this.value as F);
    }
    return ResultConstructor.success<F, T>(f(this.value as S));
  }

  asyncMap<T>(f: (r: S) => Promise<T>): Promise<Result<F, T>> {
    if (this.isFailure()) {
      return Promise.resolve(ResultConstructor.failure<F, T>(this.value as F));
    }
    return f(this.value as S).then(v => ResultConstructor.success<F, T>(v));
  }

  apply<A, B>(this: Result<F, (a: A) => B>, arg: Result<F, A>): Result<F, B>;
  apply<A, B>(this: Result<F, A>, fn: Result<F, (a: A) => B>): Result<F, B>;
  apply<A, B>(
    this: Result<F, A> | Result<F, (a: A) => B>,
    argOrFn: Result<F, A> | Result<F, (a: A) => B>
  ): ResultConstructor<F, B> {
    if (this.isFailure()) {
      return ResultConstructor.failure<F, B>(this.value as F);
    }
    if (argOrFn.isFailure()) {
      return ResultConstructor.failure<F, B>(argOrFn.value as F);
    }
    if (isWrappedFunction(this)) {
      return (argOrFn as Result<F, A>).map(this.value as (a: A) => B);
    }
    if (isWrappedFunction(argOrFn)) {
      return (argOrFn as Result<F, (a: A) => B>).apply(this as Result<F, A>);
    }
    throw new Error("Some of the arguments should be a function");
  }

  asyncApply<A, B>(
    this: Result<F, (a: Promise<A> | A) => Promise<B>>,
    arg: Result<F, Promise<A>>
  ): Promise<Result<F, B>>;
  asyncApply<A, B>(
    this: Result<F, Promise<A>>,
    fn: Result<F, Promise<(a: Promise<A> | A) => B>>
  ): Promise<Result<F, B>>;
  asyncApply<A, B>(
    this: Result<F, Promise<A>> | Result<F, (a: Promise<A> | A) => Promise<B>>,
    argOrFn: Result<F, Promise<A>> | Result<F, (a: Promise<A> | A) => Promise<B>>
  ): Promise<Result<F, B>> {
    if (this.isFailure()) {
      return Promise.resolve(ResultConstructor.failure<F, B>(this.value as F));
    }
    if (argOrFn.isFailure()) {
      return Promise.resolve(ResultConstructor.failure<F, B>(argOrFn.value as F));
    }
    if (isWrappedFunction(this)) {
      return (argOrFn as Result<F, Promise<A>>).asyncMap(this.value as (a: A | Promise<A>) => Promise<B>);
    }
    if (isWrappedFunction(argOrFn)) {
      return (argOrFn as Result<F, (a: Promise<A> | A) => Promise<B>>).asyncApply(this as Result<F, Promise<A>>);
    }
    throw new Error("Some of the arguments should be a function");
  }

  chain<A, B>(f: (r: S) => Result<A, B>): Result<A | F, B> {
    if (this.isInitial()) {
      return ResultConstructor.initial<A, B>();
    }
    const next = f(this.value as S);
    if (next.isInitial()) {
      return ResultConstructor.initial<A, B>();
    }

    if (this.isPending() || next.isPending()) {
      return ResultConstructor.pending<A, B>();
    }
    if (this.isFailure() || next.isFailure()) {
      return ResultConstructor.failure<F, B>(this.value as F);
    }
    return next;
  }

  asyncChain<A, B>(f: (r: S) => Promise<Result<A, B>>): Promise<Result<A | F, B>> {
    if (this.isInitial()) {
      return Promise.resolve(ResultConstructor.initial<A, B>());
    }
    return f(this.value as S).then(p => {
      if (p.isInitial()) {
        return ResultConstructor.initial<A, B>();
      }

      if (this.isPending() || p.isPending()) {
        return ResultConstructor.pending<A, B>();
      }

      if (this.isFailure() || p.isFailure()) {
        return ResultConstructor.failure<F, B>(this.value as F);
      }

      return p;
    });
  }

  or(x: Result<F, S>) {
    return this.isFailure() ? x : (this as Result<F, S>);
  }
}

export type Result<F, S> =
  | ResultConstructor<F, S, ResultType.Initial>
  | ResultConstructor<F, S, ResultType.Pending>
  | ResultConstructor<F, S, ResultType.Success>
  | ResultConstructor<F, S, ResultType.Failure>;

export const { merge, mergeInOne, mergeInMany, failure, success, from, chain, initial, pending } = ResultConstructor;

export const isResult = <F, S>(value: unknown | Result<F, S>): value is Result<F, S> =>
  value instanceof ResultConstructor;
