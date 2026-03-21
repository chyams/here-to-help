// Video embed abstraction — change provider here to switch all embeds
const VideoEmbed = {
  provider: 'youtube',

  createEmbed(videoId, title) {
    if (!videoId) return '<div class="video-unavailable">Video unavailable</div>';
    switch (this.provider) {
      case 'youtube':
        return `<div class="video-container">
          <iframe src="https://www.youtube.com/embed/${videoId}"
            title="${title || ''}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
        </div>`;
      default:
        return `<div class="video-container">
          <iframe src="https://www.youtube.com/embed/${videoId}"
            title="${title || ''}"
            frameborder="0" allowfullscreen></iframe>
        </div>`;
    }
  },

  getThumbnailUrl(videoId) {
    if (!videoId) return 'assets/img/H2H_logo_blue.png';
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  }
};
