import { QueryErrorResetBoundary } from "@tanstack/react-query";
import React from "react";
import AppError from "../../types/app-error";
import ErrorBlock from "./error-block";
import LoaderBlock from "./loader-block";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "../ui/button";
import ServerError from "../../types/server-error";

const WithSuspense = <P extends object>(
  Component: React.ComponentType<P>,
  CustomeErrorComp?: React.ComponentType<{ error: string }>,
CustomeLoaderComp?: React.ComponentType
): React.FC<P> => {
  return (props: P) => (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary, error }) => {
            let message;
            if (error instanceof AppError) {
              message = error.message;
            } else {
              message = "Something went wrong. Please try again later.";
            }

            if (CustomeErrorComp) {
              return <CustomeErrorComp error={message} />;
            }

            return (
              <div className="flex flex-col">
                <ErrorBlock error={message} />
               {
                error instanceof ServerError &&  <div className="text-center mt-4">
                <Button
                size={"sm"}
                  variant={"outline"}
                  onClick={() => resetErrorBoundary()}
                >
                  Try again
                </Button>
              </div>
               }
              </div>
            );
          }}
        >
          <React.Suspense
            fallback={
              CustomeLoaderComp ? (
                <CustomeLoaderComp />
              ) : (
                <LoaderBlock />
              )
            }
          >
            <Component {...props} />
          </React.Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default WithSuspense;
