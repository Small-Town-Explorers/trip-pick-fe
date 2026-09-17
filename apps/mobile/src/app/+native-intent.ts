export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  try {
    const url = new URL(path);

    if (url.protocol.startsWith('kakao') && url.hostname === 'kakaolink') {
      const shareId = url.searchParams.get('shareId');
      if (shareId) return `/c/${encodeURIComponent(shareId)}`;

      const data = url.searchParams.get('d') ?? url.searchParams.get('data');
      return data ? `/c?d=${encodeURIComponent(data)}` : '/';
    }

    return path;
  } catch {
    return '/';
  }
}
