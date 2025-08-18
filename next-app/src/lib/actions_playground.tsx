//playground
import { login } from "@/services/auth/actions";
import { useActionQuery } from "./tanstack-action/actions-querry";
import { useActionMutation } from "./tanstack-action/actions-mutation";

export function DummyComponent() {
  const o = {
    nicknameOrEmail: "user@example.com",
    password: "password123",
    rememberMe: true,
  };

  const q = useActionQuery({
    queryKey: ["login", o.nicknameOrEmail],
    action: () => login(o),
    onError: (error) => {
      if (error.serverError) {
        // Obsługa błędu serwera
        console.error("Błąd serwera:", error.serverError);
      }
      if (error.validationErrors) {
        // Obsługa błędów walidacji
        console.warn("Błędy walidacji:", error.validationErrors);
      }
      if (error.generalError) {
        // Obsługa błędów ogólnych (np. sieciowych)
        console.error("Błąd ogólny:", error.generalError);
      }
    },
    retry: false, // Wyłącz ponowne próby
  });

  // Przykład użycia useActionMutation
  const loginMutation = useActionMutation({
    action: (variables: {
      nicknameOrEmail: string;
      password: string;
      rememberMe: boolean;
    }) => login(variables),
    onError: (error) => {
      if (error.serverError) {
        console.error("Błąd serwera (mutation):", error.serverError);
      }
      if (error.validationErrors) {
        console.warn("Błędy walidacji (mutation):", error.validationErrors);
      }
      if (error.generalError) {
        console.error("Błąd ogólny (mutation):", error.generalError);
      }
    },
    onSuccess: (data) => {
      console.log("Login pomyślny:", data);
    },
  });

  const handleLogin = () => {
    loginMutation.mutate({
      nicknameOrEmail: "test@example.com",
      password: "testpassword",
      rememberMe: false,
    });
  };

  return (
    <div>
      {/* useActionQuery przykład */}
      <h2>useActionQuery przykład:</h2>
      <div>Data: {JSON.stringify(q.data)}</div>
      <div>Error: {q.error ? q.error.message : "brak"}</div>
      <div>
        ServerError:{" "}
        {q.error?.serverError ? String(q.error.serverError) : "brak"}
      </div>
      <div>
        ValidationErrors:{" "}
        {q.error?.validationErrors
          ? JSON.stringify(q.error.validationErrors)
          : "brak"}
      </div>
      <div>
        GeneralError:{" "}
        {q.error?.generalError ? String(q.error.generalError) : "brak"}
      </div>
      <div>Loading: {q.isLoading ? "true" : "false"}</div>
      <div>Fetching: {q.isFetching ? "true" : "false"}</div>
      <div>Success: {q.isSuccess ? "true" : "false"}</div>
      <div>Error (isError): {q.isError ? "true" : "false"}</div>
      <div>Status: {q.status}</div>
      <div>Data updated at: {q.dataUpdatedAt}</div>
      <div>Error updated at: {q.errorUpdatedAt}</div>
      <button onClick={() => q.refetch()}>Refetch</button>

      {/* useActionMutation przykład */}
      <h2>useActionMutation przykład:</h2>
      <div>Mutation Data: {JSON.stringify(loginMutation.data)}</div>
      <div>
        Mutation Error:{" "}
        {loginMutation.error ? loginMutation.error.message : "brak"}
      </div>
      <div>
        Mutation ServerError:{" "}
        {loginMutation.error?.serverError
          ? String(loginMutation.error.serverError)
          : "brak"}
      </div>
      <div>
        Mutation ValidationErrors:{" "}
        {loginMutation.error?.validationErrors
          ? JSON.stringify(loginMutation.error.validationErrors)
          : "brak"}
      </div>
      <div>
        Mutation GeneralError:{" "}
        {loginMutation.error?.generalError
          ? String(loginMutation.error.generalError)
          : "brak"}
      </div>
      <div>
        Mutation isPending: {loginMutation.isPending ? "true" : "false"}
      </div>
      <div>
        Mutation isSuccess: {loginMutation.isSuccess ? "true" : "false"}
      </div>
      <div>Mutation isError: {loginMutation.isError ? "true" : "false"}</div>
      <div>Mutation Status: {loginMutation.status}</div>
      <button onClick={handleLogin} disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logowanie..." : "Zaloguj się (Mutation)"}
      </button>
      <button onClick={() => loginMutation.reset()}>Reset Mutation</button>
    </div>
  );
}
