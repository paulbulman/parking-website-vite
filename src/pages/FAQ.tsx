import { Link } from "react-router-dom";
import { nextThursday, addDays, format } from "date-fns";
import FAQItem from "../components/FAQItem";
import { PageHeader } from "../components/ui";

function FAQ() {
  const thursday = nextThursday(new Date());
  const monday = addDays(thursday, 11);

  const linkClass =
    "text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors";

  return (
    <div>
      <PageHeader title="FAQ" />

      <div className="max-w-3xl space-y-5">
        <FAQItem question="How do I request a parking space?">
          <p>
            From the{" "}
            <Link className={linkClass} to="/">
              home page
            </Link>
            , click the{" "}
            <Link className={linkClass} to="/edit-requests">
              "Edit requests"
            </Link>{" "}
            button. Select any dates you would like a space, and click "Save".
            Your new requests will initially show as "Pending", before updating
            either to "Allocated" (meaning that you can park at the office), or
            "Interrupted" (meaning that you can't, sorry 🙁).
          </p>
        </FAQItem>

        <FAQItem question="When will I know whether I have a space?">
          <ul className="list-disc list-outside mt-2 ml-6 space-y-2">
            <li>
              Most spaces are released at 12am on the Thursday 11 days ahead of
              a working week. So for instance, for the week beginning{" "}
              {format(monday, "EEEE d MMMM")}, most spaces are released on{" "}
              {format(thursday, "EEEE d MMMM")}.
            </li>
            <li>
              At 11am each working day, further spaces are released for the
              subsequent working day.
            </li>
            <p className="mt-2">
              This aims to give some sort of balance between allowing people to
              make travel plans in advance, versus keeping some flexibility for
              people moved onto certain shifts at short notice.
            </p>
          </ul>
        </FAQItem>

        <FAQItem question="How are spaces allocated?">
          <p>
            When spaces are released, they are allocated to anybody who's
            requested them in priority order:
          </p>
          <ul className="list-disc list-outside mt-2 ml-6 space-y-1">
            <li>People working certain shifts are given top priority;</li>
            <li>
              People who live further away are given priority over people who
              live 'nearby'; and
            </li>
            <li>
              People who have been interrupted proportionally more frequently
              are given priority over people who have been interrupted less.
            </li>
          </ul>
          <p className="mt-3">
            Once a space is allocated it is not removed unless the person
            cancels it themselves. If you are given a space it will not be given
            to anybody else, even if they would have had higher priority had you
            both requested the space at the same time.
          </p>
        </FAQItem>

        <FAQItem question="What if I no longer need a space?">
          <p>
            If you've been allocated a space that you no longer need, please
            cancel your request via the{" "}
            <Link className={linkClass} to="/edit-requests">
              edit requests
            </Link>{" "}
            page.
          </p>
          <p className="mt-3">
            Similarly if you've been interrupted, but no longer need a space
            because you're not coming into the office for whatever reason,
            please cancel your request. This means that if a space becomes
            available it can be given straight to someone who can still use it.
          </p>

          <p className="mt-3">
            If you've been interrupted, but have now made alternative
            arrangements <strong>to come into the office</strong>, you can choose
            to stay interrupted using the "Stay interrupted" button on the{" "}
            <Link
              className={linkClass}
              to={`/daily-details/${format(new Date(), "yyyy-MM-dd")}`}
            >
              daily details
            </Link>{" "}
            page. Note that this will only be available if you were interrupted
            when the final spaces were released for that day.
          </p>
        </FAQItem>

        <FAQItem question="That's not fair!">
          <p>
            That's not actually a question. However... If you feel you're being
            unfairly disadvantaged on a regular basis, please speak to your
            manager. Management have done their best to devise a system that
            works as fairly as possible, for as many people as possible, but
            it's a surprisingly tricky task.
          </p>
        </FAQItem>

        <FAQItem question="I think I've found a bug">
          <p>
            Still not really a question - but very possible. (Normally there's a
            tester whose full-time job it is to find my mistakes... 😄) If
            something's not working as it says it should be, please create a bug
            report{" "}
            <a
              className={linkClass}
              href={`${import.meta.env.VITE_REPOSITORY_URL}/issues`}
            >
              here
            </a>{" "}
            - or, even better, create a PR to fix it!
          </p>
        </FAQItem>

        <FAQItem question="How do I know the system's not rigged?">
          <p>
            I suppose you don't, though creating this app would have been an
            awful lot of hassle to go to just for the sake of sneaking an
            occasional extra parking space for myself. If something's not
            working as it should be it's much more likely that there's a bug
            (see above), but you <em>can</em> see all the source code{" "}
            <a
              className={linkClass}
              href={`${import.meta.env.VITE_REPOSITORY_URL}/tree/main`}
            >
              here
            </a>
            . Anything that's pushed to the main branch is live. Similarly for
            the associated service/API repository.
          </p>
        </FAQItem>

        <FAQItem question="Is it secure?">
          <p>
            Yes and no. No system is ever completely secure, despite what it
            might claim. But here are some of the things in place here to
            increase the odds:
          </p>
          <ul className="list-disc list-outside mt-2 ml-6 space-y-2">
            <li>
              As long as you're using a relatively recent browser, it's
              literally impossible to access the site unless you're using an{" "}
              <a
                className={linkClass}
                href={`https://hstspreload.org/?domain=${
                  import.meta.env.VITE_APP_DOMAIN
                }`}
              >
                encrypted connection
              </a>
              .
            </li>
            <li>
              The site is hosted using{" "}
              <a className={linkClass} href="https://pages.cloudflare.com/">
                Cloudflare pages
              </a>
              , which provides numerous security features including{" "}
              <a
                className={linkClass}
                href={`https://www.ssllabs.com/ssltest/analyze.html?d=${
                  import.meta.env.VITE_APP_DOMAIN
                }&hideResults=on&latest`}
              >
                ensuring the encryption is configured correctly
              </a>
              .
            </li>
            <li>
              Potential passwords are checked against the database of
              known-breached passwords at{" "}
              <a
                className={linkClass}
                href="https://haveibeenpwned.com/Passwords"
              >
                Pwned Passwords
              </a>{" "}
              (using a{" "}
              <a
                className={linkClass}
                href="https://en.wikipedia.org/wiki/K-anonymity"
              >
                k-anonymity
              </a>{" "}
              model, meaning the <em>actual</em> password never leaves your
              computer.)
            </li>
            <li>
              The site is written using the{" "}
              <a className={linkClass} href="https://reactjs.org/">
                React library
              </a>
              , which helps protect against e.g.{" "}
              <a
                className={linkClass}
                href="https://owasp.org/www-community/attacks/xss/"
              >
                cross-site scripting (XSS)
              </a>{" "}
              attacks.
            </li>
            <li>
              Many attack vectors are mitigated by{" "}
              <a
                className={linkClass}
                href={`https://securityheaders.com/?q=${
                  import.meta.env.VITE_APP_DOMAIN
                }&hide=on&followRedirects=on`}
              >
                security headers set on the HTTP response.
              </a>
            </li>
            <li>
              The service runs on{" "}
              <a className={linkClass} href="https://aws.amazon.com/dynamodb/">
                various
              </a>{" "}
              <a className={linkClass} href="https://aws.amazon.com/lambda/">
                serverless
              </a>{" "}
              <a
                className={linkClass}
                href="https://aws.amazon.com/api-gateway/"
              >
                AWS
              </a>{" "}
              <a className={linkClass} href="https://aws.amazon.com/cognito/">
                services
              </a>
              , meaning that corresponding hosting environments are hopefully
              automagically kept up-to-date and configured correctly, by people
              much cleverer than I am. I could still have set them up badly, of
              course, but this at least gives us a fighting chance.
            </li>
          </ul>
          <p className="mt-3">
            Hopefully all of the above (and some other things besides), coupled
            with the fact that it's not exactly a high-value target for nation
            state hacker types, means that the chance of your car registration
            number being sold on the dark web is pretty low... 🤞
          </p>
          <p className="mt-3">
            You may also wish to read the{" "}
            <Link className={linkClass} to="/privacy">
              Privacy Policy
            </Link>
            .
          </p>
        </FAQItem>
      </div>
    </div>
  );
}

export default FAQ;
