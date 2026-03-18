import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSummary } from "../../hooks/api/queries/summary";
import { Button, QueryPage } from "../../components/ui";
import { HomeContent } from "./HomeContent";

function HomePage() {
  const [searchParams] = useSearchParams();
  const query = useSummary();
  const initialWeekIndex = parseInt(searchParams.get("week") ?? "0", 10) || 0;
  const [currentWeekIndex, setCurrentWeekIndex] = useState(initialWeekIndex);

  return (
    <QueryPage
      title="Summary"
      query={query}
      action={
        <Link to={`/edit-requests?week=${currentWeekIndex}`}>
          <Button>Edit Requests</Button>
        </Link>
      }
    >
      {(data) => (
        <HomeContent
          summary={data.summary}
          currentWeekIndex={currentWeekIndex}
          onWeekChange={setCurrentWeekIndex}
        />
      )}
    </QueryPage>
  );
}

export default HomePage;
