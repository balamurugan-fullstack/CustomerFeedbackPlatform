import { HealthStatusCard } from '../components/dashboard/HealthStatusCard';
import { PageContainer } from '../components/layout/PageContainer';

export function HealthPage() {
  return (
    <PageContainer
      title="System health"
      description="Inspect the API and database status from the admin workspace."
    >
      <div className="mx-auto max-w-4xl">
        <HealthStatusCard />
      </div>
    </PageContainer>
  );
}
