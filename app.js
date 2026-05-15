const CHANNEL_ID = 'UCwgc-ODtpi4OKxnbYGmyTig';

const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

const API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

let videos = [];

async function init(){
  try{
    const response = await fetch(API);
    const data = await response.json();

    videos = data.items || [];

    if(videos.length){
      setupHero(videos[0]);
    }

    render(videos);
  }catch(err){
    document.getElementById('videosGrid').innerHTML = '<p>Erro ao carregar vídeos.</p>';
  }
}

function setupHero(video){
  const thumb = video.thumbnail.replace('hqdefault','maxresdefault');

  document.getElementById('heroBanner').style.backgroundImage = `url(${thumb})`;

  document.getElementById('heroTitle').textContent = video.title;

  document.getElementById('playHero').onclick = () => play(video.link);
}

function render(list){
  const grid = document.getElementById('videosGrid');

  grid.innerHTML = '';

  list.forEach(video => {
    const id = video.link.split('v=')[1];

    grid.innerHTML += `
      <div class="card" onclick="play('${video.link}')">
        <img src="https://img.youtube.com/vi/${id}/hqdefault.jpg">

        <div class="card-title">${video.title}</div>
      </div>
    `;
  });
}

function play(url){
  const id = url.split('v=')[1];

  document.getElementById('player').src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;

  document.getElementById('modal').style.display = 'flex';
}

function closePlayer(){
  document.getElementById('player').src = '';

  document.getElementById('modal').style.display = 'none';
}

window.onclick = (e) => {
  if(e.target.id === 'modal'){
    closePlayer();
  }
}

document.getElementById('closeModal').onclick = closePlayer;

const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();

  const filtered = videos.filter(v =>
    v.title.toLowerCase().includes(term)
  );

  render(filtered);
});

init();