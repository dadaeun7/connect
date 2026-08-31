import MainTimeLine from "@/components/timeline/MainTimeLine";
import * as timeline from "@/actions/timeline";

export default function Page() {
  return (
    <MainTimeLine
      getActivity={timeline.getActivity}
      getMonthlyIssue={timeline.getMonthlyIssue}
    />
  );
}
