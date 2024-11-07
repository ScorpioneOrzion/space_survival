import { HttpStatusCode } from "@solidjs/start";

export default function NotFound() {
  return (
    <div>
      <HttpStatusCode code={404} />
      <h1>Page not found</h1>
	  <a href="/">Home</a>
    </div>
  );
}