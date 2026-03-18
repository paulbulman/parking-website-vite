import { useParams } from "react-router";
import { useDailyDetails } from "../../hooks/api/queries/dailyDetails";
import { QueryPage } from "../../components/ui";
import { DailyDetailsContent } from "./DailyDetailsContent";

function DailyDetailsPage() {
  const { date } = useParams<{ date: string }>();

  return (
    <QueryPage title="Daily Details" query={useDailyDetails()}>
      {(data) => <DailyDetailsContent data={data} urlDate={date} />}
    </QueryPage>
  );
}

export default DailyDetailsPage;
