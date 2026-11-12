import { Experience } from "@/components/Experience";
import { FAQS, MODEL_STAND, SITE, TERMS } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Experience />
      <noscript>
        <div className="nojs">
          <div className="nojs-in">
            <p className="nojs-kicker">PEAR AS · ORG NR 919 062 517 · OSLO</p>
            <h1>Pear makes you appear.</h1>
            <p className="nojs-lead">
              Not an agency on the clock, a partner in the upside.
            </p>
            <p>{MODEL_STAND}</p>

            <h2>The terms</h2>
            {TERMS.map((term) => (
              <section key={term.id}>
                <h3>{term.head.join(" ")}</h3>
                <p>{term.lead}</p>
                <p>{term.small}</p>
              </section>
            ))}

            <h2>Questions</h2>
            <dl>
              {FAQS.map((faq) => (
                <div key={faq.q}>
                  <dt>{faq.q}</dt>
                  <dd>{faq.a}</dd>
                </div>
              ))}
            </dl>

            <h2>Apply</h2>
            <p>
              Tell us what you sell and where you want to grow at{" "}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Every application
              is read, and when the model fits we answer within a week.
            </p>
          </div>
        </div>
      </noscript>
    </>
  );
}
