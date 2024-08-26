export default defineTask({
  meta: {
    name: "db:seed",
    description: "Run database seed task",
  },
  async run() {
    console.log("Running DB seed task...");

    const grants = [
      {
        name: "Innovation in Education",
        funder: "Education Trust",
        category: "University",
        description:
          "Supports innovative educational projects and initiatives.",
        websiteLink: "https://educationtrust.org/innovation",
        ceiling: 50000,
        expectedGrantCall: "Q1 2024",
        deadline: "01/01/2024",
        availability: "Open for Application",
      },
      {
        name: "Sustainable Agriculture Fund",
        funder: "Green Earth Foundation",
        category: "Industry",
        description:
          "Grants for projects promoting sustainable farming practices.",
        websiteLink: "https://greenearth.org/agriculture",
        ceiling: 100000,
        expectedGrantCall: "Q2 2024",
        deadline: "04/01/2024",
        availability: "Pre-Announcement",
      },
      {
        name: "Community Health Initiatives",
        funder: "Global Health Organization",
        category: "Government",
        description:
          "Funding for community health projects aimed at improving public health.",
        websiteLink: "https://globalhealth.org/community",
        ceiling: 75000,
        expectedGrantCall: "Q3 2024",
        deadline: "07/01/2024",
        availability: "Under Review",
      },
      {
        name: "Arts and Culture Development Grant",
        funder: "Cultural Heritage Fund",
        category: "University",
        description:
          "Supports projects that preserve and promote cultural heritage.",
        websiteLink: "https://culturalheritage.org/arts",
        ceiling: 30000,
        expectedGrantCall: "Q4 2024",
        deadline: "10/01/2024",
        availability: "Rolling Application",
      },
      {
        name: "Technology for Social Good",
        funder: "Tech for All",
        category: "Industry",
        description:
          "Grants for tech projects that aim to solve social issues.",
        websiteLink: "https://techforall.org/socialgood",
        ceiling: 120000,
        expectedGrantCall: "Q1 2024",
        deadline: "01/01/2024",
        availability: "Open for Application",
      },
      {
        name: "Environmental Protection Grant",
        funder: "Eco Fund",
        category: "Government",
        description:
          "Funding for initiatives that protect and preserve the environment.",
        websiteLink: "https://ecofund.org/protection",
        ceiling: 85000,
        expectedGrantCall: "Q2 2024",
        deadline: "04/01/2024",
        availability: "Deadline Approaching",
      },
      {
        name: "Youth Empowerment Grant",
        funder: "Future Leaders Foundation",
        category: "University",
        description:
          "Supports programs that empower youth and foster leadership skills.",
        websiteLink: "https://futureleaders.org/empowerment",
        ceiling: 40000,
        expectedGrantCall: "Q3 2024",
        deadline: "07/01/2024",
        availability: "Award Decision Pending",
      },
      {
        name: "Urban Development Fund",
        funder: "City Builders Trust",
        category: "Industry",
        description:
          "Grants for projects that enhance urban infrastructure and community spaces.",
        websiteLink: "https://citybuilders.org/urban",
        ceiling: 95000,
        expectedGrantCall: "Q4 2024",
        deadline: "10/01/2024",
        availability: "Closed for Application",
      },
      {
        name: "Research and Innovation Grant",
        funder: "Science Advancement Fund",
        category: "University",
        description:
          "Funding for cutting-edge research and innovative projects.",
        websiteLink: "https://scienceadvancement.org/research",
        ceiling: 150000,
        expectedGrantCall: "Q1 2024",
        deadline: "01/01/2024",
        availability: "Open for Application",
      },
      {
        name: "Women in STEM Grant",
        funder: "STEM Equality Fund",
        category: "University",
        description: "Supports initiatives that promote women in STEM fields.",
        websiteLink: "https://stemequality.org/womeninstem",
        ceiling: 60000,
        expectedGrantCall: "Q2 2024",
        deadline: "04/01/2024",
        availability: "Awarded",
      },
    ];

    await useDrizzle().insert(tables.grants).values(grants);

    return { result: "success" };
  },
});
