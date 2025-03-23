// src/components/Footer.tsx
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import './footer.scss';

export interface SystemInfoService {
  execute: () => Promise<{ 
    message: string; 
    data?: { version: string };
    error?: string;
  }>;
}

export interface FooterProps {
  systemInfoUsecase: SystemInfoService;

  frontVersion?: string;

  issuesUrl?: string;

  projectUrl?: string;

  mailto?: string;

  brandName?: string;

  className?: string;
}

export const Footer = (props:FooterProps) => {
  const [backVersion, setBackVersion] = useState<string>('common.loading');

  useEffect(() => {
    let isMounted = true;
    if (!props.systemInfoUsecase) {
      setBackVersion('N/A');
      return;
    }

    props.systemInfoUsecase.execute()
      .then((response) => {
        if (!isMounted) return;
        if (response.message === 'SUCCESS' && response.data) {
          setBackVersion(response.data.version);
        } else {
          setBackVersion(`Error! ${response.error}`);
        }
      })
      .catch((error: unknown) => {
        if (!isMounted) return;
        setBackVersion(`Error! ${String(error)}`);
      });

    return () => {
      isMounted = false;
    };
  }, [props.systemInfoUsecase]);

  return (
    <div className={`footer ${props.className}`}>
      {props.brandName}
      &nbsp;- <a href={`mailto:${props.mailto}`}>{props.mailto}</a>
      &nbsp;- <Trans>footer.version.front</Trans> {props.frontVersion}
      &nbsp;- <Trans>footer.version.back</Trans> <Trans>{backVersion}</Trans>
      &nbsp;- <a
        href={props.issuesUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Trans>footer.issues</Trans>
      </a>
      &nbsp;- <a
        href={props.projectUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Trans>footer.roadmap</Trans>
      </a>
      &nbsp;- <Link to="/cgu" target="_blank" rel="noopener noreferrer">CGU</Link>
    </div>
  );
};
