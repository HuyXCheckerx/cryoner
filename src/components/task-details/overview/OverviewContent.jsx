import React from 'react';
import ScraperOverview from './ScraperOverview';
import VulnerabilityOverview from './VulnerabilityOverview';
import DorksCheckerOverview from './DorksCheckerOverview';
import DumperOverview from './DumperOverview';
import DehasherOverview from './DehasherOverview';
import AntipublicOverview from './AntipublicOverview';
import ParserOverview from './ParserOverview';

const OverviewContent = ({ task, renderProgressCards }) => {
  let content;
  switch (task.type) {
    case 'scraper':
      content = <ScraperOverview task={task} renderProgressCards={renderProgressCards} />;
      break;
    case 'vulnerability':
      content = <VulnerabilityOverview task={task} renderProgressCards={renderProgressCards} />;
      break;
    case 'dorks-checker':
      content = <DorksCheckerOverview task={task} renderProgressCards={renderProgressCards} />;
      break;
    case 'dumper':
      content = <DumperOverview task={task} renderProgressCards={renderProgressCards} />;
      break;
    case 'dehasher':
      content = <DehasherOverview task={task} renderProgressCards={renderProgressCards} />;
      break;
    case 'antipublic':
        content = <AntipublicOverview task={task} renderProgressCards={renderProgressCards} />;
        break;
    case 'parser':
        content = <ParserOverview task={task} renderProgressCards={renderProgressCards} />;
        break;
    default:
      content = <div className="text-center text-slate-500 py-10">No detailed overview available for this task type.</div>;
  }

  return <div className="mt-6 space-y-6">{content}</div>;
};

export default OverviewContent;