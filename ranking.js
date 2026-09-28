window.loadQuizRanking=async function(answers,attemptId){
 const area=document.getElementById('ranking');if(!area)return;
 if(!/^https?:$/.test(location.protocol)){area.innerHTML='<h3>참여 기록과 비교하기</h3><p>순위는 온라인 퀴즈에서 확인할 수 있어요.</p><p class="note">현재 파일 모드에서는 기록을 전송하지 않아요.</p>';return;}
 area.innerHTML='<h3>참여 기록과 비교하기</h3><p>통계를 불러오고 있어요…</p>';
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
 try{
 const response=await fetch('https://lawschool-11-ranking.32203255.workers.dev/api/results',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:attemptId,answers}),signal:controller.signal});
 if(!response.ok)throw new Error('Unavailable');const data=await response.json();
 if(!Number.isInteger(data.total)||data.total<1||!data.overall||!Array.isArray(data.categories))throw new Error('Invalid statistics');
 if(document.getElementById('ranking')!==area)return;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 area.innerHTML=`<h3>참여 기록과 비교하기</h3><p class="rank-number">${data.overall.rank}위 <small>/ ${data.total}개 기록</small></p><p>전체 평균 <strong>${data.overall.average}점</strong> · 내 점수 <strong>${data.overall.score}점</strong></p>${data.total===1?'<p class="note">첫 번째 기록이에요. 다른 참여 기록이 쌓이면 비교해 보세요.</p>':''}<div class="rank-table">${data.categories.map(c=>`<div class="row"><span>${esc(c.category)}</span><strong>${c.rank}위</strong><span class="note">내 점수 ${c.score} / 20점</span><span class="note">평균 ${c.average}점</span></div>`).join('')}</div><p class="note">동점은 공동 순위 · 재도전 포함, 사람 수가 아닌 참여 기록 기준<br>기록 시점의 통계이며 실제 법률 실력을 평가하는 순위는 아니에요.</p>`;
 }catch{if(document.getElementById('ranking')===area){area.innerHTML='<h3>참여 기록과 비교하기</h3><p>통계 서버에 연결되지 않았어요.</p><p class="note">내 점수와 신청 버튼은 그대로 이용할 수 있어요.</p><button class="secondary" id="retry-ranking">통계 다시 불러오기</button>';document.getElementById('retry-ranking').onclick=()=>window.loadQuizRanking(answers,attemptId);}}
 finally{clearTimeout(timer);}
};

