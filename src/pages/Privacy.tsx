import FAQItem from "../components/FAQItem";

function Privacy() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="max-w-3xl space-y-6 text-gray-700">
        <FAQItem question="Introduction">
          <p>
            This app requires a limited amount of personal information to
            function correctly. As per the{" "}
            <a
              className="text-blue-600 hover:text-blue-800"
              href="http://www.legislation.gov.uk/ukpga/2018/12/contents/enacted"
            >
              Data Protection Act 2018
            </a>
            , steps have been taken to ensure this information is:
          </p>
          <ul className="list-disc list-outside mt-2 ml-6">
            <li>used fairly, lawfully and transparently;</li>
            <li>used for specified, explicit purposes;</li>
            <li>
              used in a way that is adequate, relevant and limited to only what
              is necessary;
            </li>
            <li>accurate and, where necessary, kept up to date;</li>
            <li>kept for no longer than is necessary; and</li>
            <li>
              handled in a way that ensures appropriate security, including
              protection against unlawful or unauthorised processing, access,
              loss, destruction or damage.
            </li>
          </ul>
          <p className="mt-2">You also have the right to:</p>
          <ul className="list-disc list-outside mt-2 ml-6">
            <li>be informed about how your data is being used;</li>
            <li>access personal data;</li>
            <li>have incorrect data updated;</li>
            <li>have data erased;</li>
            <li>stop or restrict the processing of your data;</li>
            <li>
              data portability (allowing you to get and reuse your data for
              different services); and
            </li>
            <li>
              object to how your data is processed in certain circumstances.
            </li>
          </ul>
        </FAQItem>

        <FAQItem question="What personal information is collected, and why?">
          <p>
            All personal information collected is required for the app to
            function correctly:
          </p>
          <ul className="list-disc list-outside mt-2 ml-6">
            <li>
              your email address, to allow you to reset your account password,
              and to receive notifications;
            </li>
            <li>
              your name and car registration number, to allow other people to
              find out who is blocking them in; and
            </li>
            <li>
              approximately how far you live from the office, to allow the
              system to allocate spaces accordingly.
            </li>
          </ul>
          <p className="mt-2">
            Note that, in the case of where you live, the only information
            stored is an approximate numerical distance. Your physical address
            is never stored, even partially.
          </p>
        </FAQItem>

        <FAQItem question="How is personal information secured?">
          <p>
            All personal information is stored in managed AWS services and
            encrypted at rest. Access to this underlying data is restricted to
            those who need it in order to support the running of the system. All
            such accounts have strong, unique passwords and are protected by
            multi-factor authentication.
          </p>
          <p className="mt-2">
            Some personal information (name, car registration number) is
            available to other users of the system. In order to protect this
            data, users are not allowed to sign up to the system themselves; all
            new accounts must be created by an administrative user.
          </p>
          <p className="mt-2">
            Registration numbers are not visible to browse; they are only
            displayed when searching for a specific registration number. This is
            the legitimate use case of another user finding out who is blocking
            them in.
          </p>
          <p className="mt-2">
            No personal information is ever shared with any third-party. No
            adverts or tracking cookies are used.
          </p>
          <p className="mt-2">
            Further technical protections are in place to attempt to make the
            overall system as secure as is practicably possible. Details of some
            of these are on the FAQ page.
          </p>
        </FAQItem>

        <FAQItem question="Contact details">
          <p>
            If you have any questions relating to how your personal data is
            managed, please contact help@{import.meta.env.VITE_APP_DOMAIN}.
          </p>
        </FAQItem>
      </div>
    </div>
  );
}

export default Privacy;
