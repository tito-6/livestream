import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import StreamPlayer from '../../components/StreamPlayer';
import AmbientChat from '../../components/AmbientChat';
import StreamInfo from '../../components/StreamInfo';
import PollWidget from '../../components/PollWidget';

export default function StreamPage() {
  const router = useRouter();
  const { id } = router.query;
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [showChat, setShowChat] = useState(true);
  const [showPoll, setShowPoll] = useState(false);

  return (
    <Layout lang={lang}>
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          
          {/* Main Grid Layout */}
          <div className="grid lg:grid-cols-12 gap-6">
            
            {/* Stream Player Column */}
            <div className={showChat ? 'lg:col-span-9' : 'lg:col-span-12'}>
              <StreamPlayer streamId={id as string} lang={lang} />
              <StreamInfo streamId={id as string} lang={lang} />
            </div>

            {/* Chat & Widgets Column */}
            {showChat && (
              <div className="lg:col-span-3 space-y-4">
                <AmbientChat 
                  streamId={id as string} 
                  lang={lang}
                  onClose={() => setShowChat(false)}
                />
                
                {showPoll && (
                  <PollWidget 
                    streamId={id as string}
                    lang={lang}
                  />
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </Layout>
  );
}

