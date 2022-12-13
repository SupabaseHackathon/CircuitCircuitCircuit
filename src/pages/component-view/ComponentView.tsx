import { createClient } from '@supabase/supabase-js';
import { Navigate, useParams } from 'react-router-dom';
import { ComponentEditor } from '../../components/component-editor/ComponentEditor';
import { Page } from '../../components/page/Page';
import './ComponentView.css';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    realtime: {
      params: {
        eventsPerSecond: 30,
      },
    },
  }
);

export const ComponentView = () => {
  const { componentId } = useParams();

  if (!componentId) {
    return <Navigate to={'/'} />;
  }

  // Fetch component

  const channel = supabase.channel(componentId).subscribe();

  return (
    <Page>
      <div id="__component-view-container">
        <h2>You are viewing component {componentId}</h2>
        <ComponentEditor channel={channel} />
      </div>
    </Page>
  );
};
