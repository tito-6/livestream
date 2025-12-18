# Audio Setup Guide for OBS & StreamCast

If you are streaming a browser window (e.g., YouTube connection) and watching the client at the same time, you may encounter audio echo or want to mute the source for yourself but keep it for the stream.

## How to Mute Source for You, but Stream to Client

1.  **Use OBS Application Audio Capture (Recommended)**
    *   In OBS, delete "Desktop Audio" from Audio Mixer.
    *   Add Source -> **Application Audio Capture (Beta)**.
    *   Select the Chrome window playing the source video.
    *   Now, you can **Mute** that Chrome Tab or Window in your **Windows Volume Mixer**, and OBS will *still* capture the audio!

2.  **Windows Volume Mixer Method**
    *   Right-click the Speaker icon in your Windows Taskbar.
    *   Select **Open Volume Mixer**.
    *   Find the Chrome instance playing the source video.
    *   Lower its volume slider or click the Speaker icon to Mute it.
    *   *Verify in OBS*: Does the audio meter still move? If yes, great! If no, you need "Application Audio Capture" (Step 1).

## Client Audio Troubleshooting

*   The StreamCast Client (`/live`) starts **Muted** by default due to Browser Autoplay policies.
*   Click the volume icon in the video player to Unmute.
*   If you hear an echo, ensure you are not playing the Client video on the same machine that is capturing "Desktop Audio".
