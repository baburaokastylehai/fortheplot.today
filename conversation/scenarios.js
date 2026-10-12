export const openings = {
  framing: 'Our CEO wants an AI feature. Where would you start?',
  market: "There's interest, but no revenue. Would you still build it?",
  leadership: 'Leadership has already made the decision. When would you stop pushing back?',
  tripboard: 'What made you build Tripboard?'
};

const reply = (paragraphs, followups = [], evidence = false) => ({ paragraphs, followups, evidence });

export function respond(text, state) {
  const input = text.toLowerCase();
  if (/astrolog|horoscope|sexual|girlfriend|boyfriend|married|dating|relationship|private life|personal life|hack into|steal|commit fraud/.test(input)) {
    return reply(["I keep this conversation to professional work and intellectual interests. I won't speak for Atharva's private life or help with wrongdoing."]);
  }
  if (/\b(music|song|vienna|billy joel|john mayer|mehdi hassan)\b/.test(input)) {
    state.topic = 'music';
    return reply(["The rotation on fortheplot moves between Billy Joel, John Mayer, Mehdi Hassan, and Sinatra. That mix is part of what makes the site feel personal.", "Vienna is on the record tonight. What have you been coming back to?"]);
  }
  let recognized = true;
  if (/tripboard|trip board|no login|no account|security risk|just use chat|that tradeoff/.test(input)) state.topic = 'tripboard';
  else if (/no revenue|no market|monetiz|won.t pay|revenue next quarter|market demand/.test(input)) state.topic = 'market';
  else if (/\b(ai|ceo|leadership|retention|setup|competitor|product question)\b/.test(input)) state.topic = 'framing';
  else if (!(state.topic === 'tripboard' && /change first|improve|whatsapp/.test(input)) && !(state.topic === 'framing' && /already decided|must ship|measure|metric/.test(input)) && !(state.topic === 'market' && /next quarter|deadline|runway|free|use it/.test(input))) recognized = false;
  if (!recognized) return reply(["The model isn't connected in this study yet, so I don't have a considered answer to that. This preview only has a few authored sample replies."], []);

  if (state.topic === 'tripboard') {
    if (/security|risk|private|that tradeoff/.test(input)) {
      return reply(["Yes. Anyone with the link can see and add to the board. That's a real tradeoff, and the sharing experience needs to make it clear.", "For a lightweight trip board, an account-free start removes work for the group. For this representation, private evidence needs a much stricter boundary. The same choice wouldn't fit both products."], ['What would you change first?'], true);
    }
    if (/change first|improve|next/.test(input)) {
      return reply(["I'd look at whether a group can find the important thing quickly: a booking, a link, or a decision that still needs to be made.", "A useful first test is watching someone return to the board after a few days away. Can they understand what's settled without asking the group chat again?"], ['Is no login a security risk?'], true);
    }
    if (/just use chat|whatsapp/.test(input)) {
      return reply(["Chat is good at the conversation. It gets awkward when you need to retrieve a booking or tell which of six hotel links the group actually chose.", "Tripboard gives those links and decisions a place to stay. The interesting product question is how little structure you can add while making that return visit easier."], ["Isn't no login a security risk?"], true);
    }
    return reply(["Tripboard tackles a very ordinary problem: a group's useful links get buried in the conversation around them.", "It gives stays, transport, activities, and food finds one shared place. You can see what's being considered and what's booked. One link gets the group in, without everyone having to create an account."], ["Why not just use chat?", "Isn't no login a security risk?"], true);
  }
  if (state.topic === 'market') {
    if (/won.t pay|free|use it/.test(input)) {
      return reply(["Then there's a useful distinction: people may value the product without valuing the offer you're asking them to pay for.", "I'd look at who depends on it, what they'd lose without it, and whether a different buyer gets the economic benefit. Usage is evidence to investigate; it doesn't settle the business model."], ['We need revenue next quarter.']);
    }
    if (/next quarter|deadline|runway/.test(input)) {
      return reply(["That puts a time constraint on the decision. I'd separate the longer-term market hypothesis from what can credibly produce revenue this quarter.", "I'd test a narrowly defined paid offer with a specific buyer, set a date to decide, and agree in advance what we'll do if it doesn't work. A possible market isn't a reason to ignore runway."], ["They use it, but won't pay."]);
    }
    return reply(["I'd separate evidence of a need from evidence of a workable business. No revenue tells us the second hasn't been established. It doesn't, on its own, tell us there is no market.", "Interest is still a weak signal. What have people done beyond saying they like it: used it repeatedly, changed a habit, or committed time or money?"], ["They use it, but won't pay.", 'We need revenue next quarter.']);
  }
  if (state.topic === 'framing') {
    if (/two weeks|setup|configuration|onboard/.test(input)) {
      return reply(["That changes where I'd look. If people understand the value but setup takes two weeks, the obstacle is getting to that value.", "AI might help with configuration. I'd compare that with a simpler default or a smaller first setup. The test is time to a useful result, including the work needed to verify what the AI did."], ['But leadership has already decided.']);
    }
    if (/already decided|leadership|competitor|must ship/.test(input)) {
      return reply(["If the decision is made, I'd shift to making the bet explicit. Which customer problem are we targeting, what can we test quickly, and what would make us change course?", "I'd put the success measures and a fallback in place before shipping. That gives the team a way to learn and respond without reopening the same argument every week."], ['What would you measure?']);
    }
    if (/measure|success|metric/.test(input)) {
      return reply(["I'd measure completion of the original job, time to a useful result, and how often someone has to correct or verify the output.", "Feature usage can help diagnose what's happening, but it isn't enough. I'd also check whether the improvement lasts after the novelty wears off."], ['Setup takes two weeks.']);
    }
    return reply(["I'd first make the customer problem concrete. Which part of their work is difficult enough that a new feature deserves their attention?", "Then I'd look at whether AI changes that experience materially. What are people struggling to finish today?"], ['Setup takes two weeks.', 'But leadership has already decided.']);
  }
  return reply(["The model isn't connected in this study yet, so I don't have a considered answer to that. This preview only has a few authored sample replies."]);
}
