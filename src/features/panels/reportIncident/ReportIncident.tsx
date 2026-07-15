import ReportIcon from "@assets/Icon/Report.svg?react";
import EmptyMessage from "@/components/Messages/EmptyMessage/EmptyMessage";
import PanelLayout from "@/components/Panels/components/PanelLayout/PanelLayout";


const ReportIncident = () => {
  return (
    <PanelLayout panelTitle="Report Incident" panelTitleIcon={<ReportIcon />}>
      <EmptyMessage
        icon={<ReportIcon />}
        title="Coming Soon"
        subtitle="Report any incidents to the Stewards when this feature is released."
      />
    </PanelLayout>
  );
};

export default ReportIncident;
