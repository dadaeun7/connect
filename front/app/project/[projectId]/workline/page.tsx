import MainWorkline from "@/components/workline/MainWorkline";
import * as actions from "@/actions/workline";

export default function Page() {
  return (
    <MainWorkline
      getGithubRepo={actions.getGithubRepo}
      getGitBrach={actions.getGitBrach}
      getFigmaState={actions.getFigmaState}
      getNotionList={actions.getNotionList}
      getIssueNextPage={actions.getIssueNextPage}
      getIssueDetail={actions.getIssueDetail}
      getUserInfo={actions.getUserInfo}
    />
  );
}
