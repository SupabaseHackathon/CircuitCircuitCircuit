import { useParams } from 'react-router-dom';
import { ComponentEditor } from '../../components/component-editor/ComponentEditor';
import { Page } from '../../components/page/Page';
import './ComponentView.css';

export const ComponentView = () => {
  const { componentId } = useParams();

  // Fetch component

  return (
    <Page>
      <div id="__component-view-container">
        <h2>You are viewing component {componentId}</h2>
        <ComponentEditor />
      </div>
    </Page>
  );
};
