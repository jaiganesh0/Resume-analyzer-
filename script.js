// Resume analyzer - vanilla JS, rule-based keyword + structure scoring.
const SKILLS = ['html','css','javascript','typescript','react','node','java','python','sql','mysql','mongodb','git','github','linux','networking','aws','azure','docker','kubernetes','devops','api','rest','cloud','firebase','c++','php','agile','testing','figma','excel'];
const SECTIONS = { Education: /education|b\.?sc|b\.?e\b|degree|university|college/i, Experience: /experience|intern|worked|employment/i, Skills: /skills|technologies|tools/i, Projects: /projects?\b/i };
const $ = id => document.getElementById(id), has = (t, k) => new RegExp('(^|[^a-z0-9+])' + k.replace(/[+]/g, '\\+') + '($|[^a-z0-9+])', 'i').test(t);
$('f').addEventListener('submit', e => {
  e.preventDefault(); const r = $('resume').value, jd = $('jd').value;
  if (r.trim().split(/\s+/).length < 30) { $('err').textContent = 'Please paste at least 30 words of your resume.'; return; } $('err').textContent = '';
  const need = SKILLS.filter(s => has(jd, s)), found = need.filter(s => has(r, s)), miss = need.filter(s => !found.includes(s)), mySkills = SKILLS.filter(s => has(r, s));
  const skillScore = need.length ? found.length / need.length : Math.min(1, mySkills.length / 8);
  const sec = Object.entries(SECTIONS).map(([n, rx]) => [n, rx.test(r)]), email = /\S+@\S+\.\S+/.test(r), phone = /(\+?\d[\d\s-]{8,})/.test(r), words = r.trim().split(/\s+/).length;
  const verbs = (r.match(/\b(built|developed|designed|created|led|managed|implemented|improved|launched|organized)\b/gi) || []).length;
  const struct = (sec.filter(s => s[1]).length / 4) * 0.5 + (email ? 0.15 : 0) + (phone ? 0.1 : 0) + (words >= 150 && words <= 700 ? 0.15 : 0.05) + Math.min(verbs, 4) / 4 * 0.1;
  const score = Math.round((skillScore * 0.55 + struct * 0.45) * 100), cls = score >= 75 ? 's-good' : score >= 50 ? 's-mid' : 's-low';
  const tips = []; sec.filter(s => !s[1]).forEach(s => tips.push(`Add a clear "${s[0]}" section.`));
  if (!email) tips.push('Add a professional email address.'); if (!phone) tips.push('Add a phone number.');
  if (words < 150) tips.push('Your resume is short. Add more detail about projects and results.'); if (words > 700) tips.push('Your resume is long. Keep it to one or two pages.');
  if (verbs < 3) tips.push('Start bullet points with action verbs such as built, developed, designed or led.');
  if (miss.length) tips.push(`Add these skills if you really have them: ${miss.join(', ')}.`);
  if (!jd.trim()) tips.push('Paste a job description to get a targeted skill match.');
  $('res').hidden = false; $('res').innerHTML = `<p class="score ${cls}">${score}/100</p><p>${score >= 75 ? 'Strong match.' : score >= 50 ? 'Decent, with room to improve.' : 'Needs work before applying.'}</p>
   <h3>Skills found in your resume${need.length ? ' (matching the job)' : ''}</h3><ul class="pills">${(need.length ? found : mySkills).map(s => `<li class="have">${s}</li>`).join('') || '<li>None detected</li>'}</ul>
   ${miss.length ? `<h3>Missing skills from the job description</h3><ul class="pills">${miss.map(s => `<li class="miss">${s}</li>`).join('')}</ul>` : ''}
   <h3>Resume sections</h3><ul class="pills">${sec.map(s => `<li class="${s[1] ? 'have' : 'miss'}">${s[0]}</li>`).join('')}</ul>
   <h3>Suggestions</h3><ul>${tips.map(t => `<li>${t}</li>`).join('') || '<li>Looks good. Proofread once more before sending.</li>'}</ul>`;
});
