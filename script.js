document.addEventListener('DOMContentLoaded', ()=>{

  const plan = [
    {day:"Poniedziałek", title:"Kondycja + Technika", bullets:["Skakanka 10 min","Interwały 10×100m","Worki 6×3min"]},
    {day:"Wtorek", title:"Siła + Dynamika", bullets:["Przysiady 4×8","Martwy ciąg 4×6","Plyometria"]},
    {day:"Środa", title:"Regeneracja", bullets:["Bieg 30-40 min","Mobilność 15 min"]},
    {day:"Czwartek", title:"Szybkość + Technika", bullets:["Tarcze 5×3min","Sprinty 10×20m","Guma oporowa"]},
    {day:"Piątek", title:"Full Body + Sparing", bullets:["Obwód 4 rundy","Sparing 4-6×3min"]},
    {day:"Sobota", title:"Aktywna regeneracja", bullets:["Pływanie / Joga / Mobilność"]},
    {day:"Niedziela", title:"Odpoczynek", bullets:["Pełny odpoczynek"]}
  ];

  const library = [
    {title:"Prosty (jab)", desc:"Technika ciosu prostego", video:"d4R1r_Z0F5g"},
    {title:"Hak", desc:"Hak — rotacja bioder", video:"d4R1r_Z0F5g"},
    {title:"Low kick", desc:"Kopnięcie niskie — pracuj nad balans", video:"d4R1r_Z0F5g"},
    {title:"Przysiad siłowy", desc:"Praca nad siłą nóg", video:"d4R1r_Z0F5g"}
  ];

  const planGrid = document.getElementById('planGrid');
  plan.forEach(p=>{
    const el = document.createElement('div');
    el.className='plan-item';
    el.innerHTML = `<h4>${p.day} — ${p.title}</h4><ul>${p.bullets.map(b=>'<li>'+b+'</li>').join('')}</ul>`;
    planGrid.appendChild(el);
  });

  const libraryGrid = document.getElementById('libraryGrid');
  library.forEach(l=>{
    const el = document.createElement('div');
    el.className='lib-card';
    el.innerHTML = `<h4>${l.title}</h4><p>${l.desc}</p>
      <div class="lib-play"><iframe width="100%" height="160" src="https://www.youtube.com/embed/${l.video}" frameborder="0" allowfullscreen></iframe></div>`;
    libraryGrid.appendChild(el);
  });

  // Timer logic
  let timer = null;
  let currentRound = 0;
  const timerDisplay = document.getElementById('timerDisplay');
  const roundInfo = document.getElementById('roundInfo');

  function formatS(sec){
    const m = Math.floor(sec/60).toString().padStart(2,'0');
    const s = (sec%60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  document.getElementById('startTimer').addEventListener('click', ()=>{
    if (timer) return;
    const rounds = parseInt(document.getElementById('rounds').value,10) || 3;
    const roundTime = parseInt(document.getElementById('roundTime').value,10) || 180;
    const restTime = parseInt(document.getElementById('restTime').value,10) || 60;
    currentRound = 1;
    let state = 'round';
    let remaining = roundTime;
    timerDisplay.textContent = formatS(remaining);
    roundInfo.textContent = `Runda ${currentRound} / ${rounds} — w trakcie`;
    timer = setInterval(()=>{
      remaining--;
      timerDisplay.textContent = formatS(remaining);
      if (remaining <= 0){
        if (state === 'round'){
          if (currentRound >= rounds){
            clearInterval(timer); timer=null;
            roundInfo.textContent = 'Trening zakończony';
            timerDisplay.textContent = '00:00';
            return;
          } else {
            state = 'rest';
            remaining = restTime;
            roundInfo.textContent = `Przerwa — za chwilę runda ${currentRound+1}`;
          }
        } else {
          currentRound++;
          state = 'round';
          remaining = roundTime;
          roundInfo.textContent = `Runda ${currentRound} / ${rounds} — w trakcie`;
        }
      }
    }, 1000);
  });

  document.getElementById('stopTimer').addEventListener('click', ()=>{
    if (timer) { clearInterval(timer); timer = null; roundInfo.textContent='Zatrzymano'; }
  });

  // Profile save (localStorage)
  const profileForm = document.getElementById('profileForm');
  profileForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = {
      weight: document.getElementById('weight').value,
      height: document.getElementById('height').value,
      level: document.getElementById('level').value,
      goals: {
        condition: document.getElementById('goal_condition').checked,
        speed: document.getElementById('goal_speed').checked,
        strength: document.getElementById('goal_strength').checked,
        technique: document.getElementById('goal_technique').checked
      }
    };
    localStorage.setItem('fightfit_profile', JSON.stringify(data));
    alert('Profil zapisany localnie (demo).');
  });

  // load profile if exists
  const saved = localStorage.getItem('fightfit_profile');
  if (saved){
    try{
      const p = JSON.parse(saved);
      document.getElementById('weight').value = p.weight || 75;
      document.getElementById('height').value = p.height || 180;
      document.getElementById('level').value = p.level || 'Średniozaawansowany';
      document.getElementById('goal_condition').checked = !!p.goals.condition;
      document.getElementById('goal_speed').checked = !!p.goals.speed;
      document.getElementById('goal_strength').checked = !!p.goals.strength;
      document.getElementById('goal_technique').checked = !!p.goals.technique;
    }catch(e){}
  }

});
