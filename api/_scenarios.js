// The four scenarios for Module 2, The Hesitant Client.
// Edit the wording here. The hidden worry is only sent to the room when you press Reveal.

const NEUTRAL = [
  "I am not sure that answers my question. As I said, it is fairly simple.",
  "Perhaps. I still need to think about it.",
  "Possibly. I am not sure where this is going.",
  "I will think about it."
];

const SCENARIOS = [
  {
    "id": "A",
    "title": "Payroll switch",
    "worry": "Standing",
    "card": "Mr K., managing director of a retail company with 60 staff. He has DCDM’s proposal for accounting and payroll, which is 15% above what he pays his current firm.",
    "hidden": "Last December his previous provider ran payroll late. He had to stand in front of his staff and apologise, and it still comes up. What he fears most is losing face with his people a second time.",
    "opening": "Your proposal is 15% above what we pay now. Can you bring the fee down?",
    "exchanges": [
      {
        "aim": "Find out what he is deciding, before touching the fee",
        "strongQuestion": "Before we look at the figure, what will you be weighing between us and your current firm?",
        "strong": "Price matters, of course. But I also need the switch to go without problems.",
        "weak": "So the price was flexible all along. Then I will need to think about it.",
        "weakTrigger": "Discount offered or fee defended"
      },
      {
        "aim": "Find the worry behind “without problems”",
        "strongQuestion": "When you say without problems, which part of the switch worries you most?",
        "strong": "Payroll. Last December our people were paid late, and that cannot happen again.",
        "weak": "Every firm says that. Let me think about it and come back after month-end.",
        "weakTrigger": "Reassurance: “We are very experienced”"
      },
      {
        "aim": "Size it: what would it cost him",
        "strongQuestion": "If that happened again in the first month with us, what would it cost you?",
        "strong": "More than money. I had to stand in front of my staff and apologise. My supervisors still mention it.",
        "weak": "That sounds fine on paper. I would still have to explain a change of firm to my staff.",
        "weakTrigger": "Jumps to a solution"
      },
      {
        "aim": "Offer a next step that answers the worry",
        "strongQuestion": "If we ran the first payroll in parallel, so you check both before anyone is paid, would that let you decide?",
        "strong": "That would settle it. Send it in writing with the fee and we can sign by Friday.",
        "weak": "Send me something in writing and I will look at it.",
        "weakTrigger": "a pitch, a reassurance or a vague promise"
      }
    ],
    "endings": {
      "commits": "You understood what matters to me. Let’s go ahead, send me the engagement letter.",
      "postpones": "It is interesting. Send me the revised proposal and I will discuss it with my directors.",
      "declines": "Thank you for your time. I think we will stay where we are for this year."
    },
    "reveal": "The fee was never the real question. Mr K. was deciding whether he could trust a new firm with his staff’s salaries after being embarrassed once. A discount could not answer that, the parallel run could."
  },
  {
    "id": "B",
    "title": "Tax return",
    "worry": "Exposure",
    "card": "Mrs D., owner of a family import company with 25 staff. Her in-house accountant left mid-year, and she asks DCDM to take over this year’s tax return.",
    "hidden": "A letter from the MRA about last year’s return has been sitting unanswered for six weeks. She fears a penalty she cannot plan for, and that a new firm will find more mistakes.",
    "opening": "How quickly can you file our return? I need it done before the deadline.",
    "exchanges": [
      {
        "aim": "Find out what she is deciding, before giving a date",
        "strongQuestion": "Before I give you a date, what matters most to you about this year’s filing?",
        "strong": "Getting it right. Last year was not done as carefully as I thought.",
        "weak": "Good. Send me your fee and the timeline and we will see.",
        "weakTrigger": "Gives a timeline straight away"
      },
      {
        "aim": "Find the worry behind “not done carefully”",
        "strongQuestion": "When you say not as carefully as you thought, what has happened since?",
        "strong": "We received a letter from the MRA about last year. I have not answered it yet.",
        "weak": "I am sure you do good work. I just need it filed.",
        "weakTrigger": "Reassurance about quality"
      },
      {
        "aim": "Size it: what is at stake",
        "strongQuestion": "If that letter stays unanswered, what is at stake for you?",
        "strong": "Penalties I cannot plan for, and maybe another year being looked at. That keeps me awake.",
        "weak": "Maybe. I would rather keep this simple and just file.",
        "weakTrigger": "Offers to handle everything"
      },
      {
        "aim": "Offer a next step that answers the worry",
        "strongQuestion": "If we started by reviewing the letter with you this week, before the filing, would that give you what you need to decide?",
        "strong": "Yes. If you can look at it first, I am ready to go ahead.",
        "weak": "Let me speak to my brother, he is a shareholder, and come back to you.",
        "weakTrigger": "a pitch, a reassurance or a vague promise"
      }
    ],
    "endings": {
      "commits": "Thank you for asking. Can you come on Thursday? I will have the letter ready.",
      "postpones": "Send me your proposal for the return. We will see about the rest later.",
      "declines": "I think I will ask my old accountant to finish it after all."
    },
    "reveal": "Speed was the surface ask. Mrs D. was deciding whether she could bring an unanswered letter into the open without being judged. Once someone asked what had happened since, the real work became visible."
  },
  {
    "id": "C",
    "title": "Accounting comparison",
    "worry": "Effort",
    "card": "Mr R., finance manager of a logistics company with 40 staff. He has asked DCDM for a quote on accounting services and says he only wants a comparison.",
    "hidden": "His team is two people and the closing is several months behind. Changing firm during year-end would mean pulling everything together, which his team cannot absorb. The bank also wants accounts for a facility renewal.",
    "opening": "We are fine with our current firm. We only wanted a comparison.",
    "exchanges": [
      {
        "aim": "Find out what a change would have to look like",
        "strongQuestion": "That makes sense. What would a better arrangement need to look like for you to consider it?",
        "strong": "Honestly, something that does not add work. My team is two people.",
        "weak": "Thank you, it all sounds good. As I said, we are fine for now.",
        "weakTrigger": "Pitches DCDM’s services"
      },
      {
        "aim": "Find the worry behind “does not add work”",
        "strongQuestion": "What would the extra work be for your team if you changed?",
        "strong": "Pulling everything together. Our closing is a few months behind, and changing firm in the middle would be a lot.",
        "weak": "I am sure it is. It is just not the right time.",
        "weakTrigger": "“Our onboarding is very smooth”"
      },
      {
        "aim": "Size it: what does staying behind cost",
        "strongQuestion": "If the closing stays behind until year-end, what does that cost you?",
        "strong": "The bank is asking for accounts for our facility renewal. I am running out of time.",
        "weak": "We will manage. We always do.",
        "weakTrigger": "Proposes a full migration plan"
      },
      {
        "aim": "Offer a next step that removes the effort",
        "strongQuestion": "If we sent someone on site for the first month to collect and sort the records, so your team does not carry it, would that change the decision?",
        "strong": "That would change things. Can you send me how that would work and what it costs?",
        "weak": "Let me see after year-end.",
        "weakTrigger": "a pitch, a reassurance or a vague promise"
      }
    ],
    "endings": {
      "commits": "If you can take the catch-up off my team, I can take this to my director this week.",
      "postpones": "Send me the comparison. I will look at it after year-end.",
      "declines": "Thank you. For now we will stay as we are."
    },
    "reveal": "“We are fine” was protecting a two-person team that was already overloaded, and accounts the bank needed. The value was not a better service, it was taking the catch-up off his team."
  },
  {
    "id": "D",
    "title": "Cash-flow forecast",
    "worry": "Money",
    "card": "Mrs L., founder of a restaurant group with 30 staff. She asks DCDM for an informal look at her cash-flow forecast.",
    "hidden": "Cash is tight after three difficult months. She is unsure she can meet payroll in the low season, cannot see how to pay for a full advisory engagement, and is embarrassed to say so.",
    "opening": "Could you just have a quick look at our cash-flow forecast? It should not take long.",
    "exchanges": [
      {
        "aim": "Find out what decision the forecast supports",
        "strongQuestion": "Happy to help. What decision is the forecast meant to support?",
        "strong": "Whether we can open the third restaurant this year. Or, if I am honest, whether we should.",
        "weak": "A full engagement is more than I had in mind. I only need a quick look.",
        "weakTrigger": "Quotes a fee and a scope"
      },
      {
        "aim": "Find the worry behind “whether we should”",
        "strongQuestion": "When you say whether you should, what is giving you doubt?",
        "strong": "The last three months were harder than planned. Cash is tighter than I would like.",
        "weak": "I just need someone to check the figures.",
        "weakTrigger": "Explains what a forecast review covers"
      },
      {
        "aim": "Size it: what would continued pressure mean",
        "strongQuestion": "If cash stayed this tight for another quarter, what would that mean for you?",
        "strong": "I would be worried about paying my staff in the low months. That is not something I can let happen.",
        "weak": "We will manage. Can you just look at it?",
        "weakTrigger": "Offers a long list of services"
      },
      {
        "aim": "Offer a next step she can afford to say yes to",
        "strongQuestion": "If we started with a short fixed-fee review of the next six months of cash, with a clear answer on the third restaurant, would that help you decide?",
        "strong": "Yes. If the fee is fixed, I can say yes to that today.",
        "weak": "Let me see what my bank says first.",
        "weakTrigger": "a pitch, a reassurance or a vague promise"
      }
    ],
    "endings": {
      "commits": "A fixed fee and a clear answer, that is exactly what I need. When can you start?",
      "postpones": "Send me a short proposal and I will think about it.",
      "declines": "Thank you. I will ask a friend who is good with figures."
    },
    "reveal": "“A quick look” was a way of asking for help without committing to a fee she could not afford. The fixed-fee step answered the money worry and still gave DCDM paid work."
  }
];

module.exports = { SCENARIOS, NEUTRAL };
