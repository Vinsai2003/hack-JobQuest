import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TESTIMONIALS = [
  {
    quote:
      "JobQuest matched me with my dream internship in just 2 weeks. Amazing!",
    link: "#",
    author: {
      name: "Sarah Williams",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
      role: "CS Student, MIT",
    },
    company: {
      logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg",
      name: "",
    },
  },
  {
    quote:
      "Interview prep tools helped me land offers. JobQuest is game-changing!",
    link: "#",
    author: {
      name: "John Doe",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
      role: "Recent Grad, Stanford",
    },
    company: {
      logo: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg",
      name: "",
    },
  },
];

const CASE_STUDIES = [
  {
    title: "How JobQuest Landed 500+ Students Jobs",
    link: "#",
    stats: [
      {
        number: "500+",
        text: "successful job placements",
      },
    ],
    author: {
      name: "John Doe",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
      role: "Career Counselor",
    },
    background:
      "https://images.pexels.com/photos/2678468/pexels-photo-2678468.jpeg",
  },
  {
    title: "95% Skills Match Accuracy Rate",
    link: "#",
    stats: [
      {
        number: "95%",
        text: "accurate job recommendations",
      },
    ],
    author: {
      name: "Jane Smith",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
      role: "Student Success Lead",
    },
    background:
      "https://images.pexels.com/photos/7710087/pexels-photo-7710087.jpeg",
  },
  {
    title: "10K+ Active Students Using JobQuest",
    link: "#",
    stats: [
      {
        number: "10K+",
        text: "students finding opportunities",
      },
    ],
    author: {
      name: "John Doe",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-4.webp",
      role: "Platform Director",
    },
    background:
      "https://images.pexels.com/photos/4623173/pexels-photo-4623173.jpeg",
  },
];

interface AuthorProps {
  image: string;
  name: string;
  role: string;
}

const Author = ({ image, name, role }: AuthorProps) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-10 rounded-xl bg-background/50">
        <AvatarImage src={image} alt={name} />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-0.5">
        <div className="text-sm font-medium text-foreground">{name}</div>
        <div className="text-sm text-muted-foreground">{role}</div>
      </div>
    </div>
  );
};

const TestimonialSection = () => {
  return (
    <section className="py-24">
      <div className="container max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl font-bold text-primary tracking-tight md:text-5xl">
              What students say about JobQuest
            </h2>
            <div className="max-w-[28.75rem]">
              <p className="text-lg text-muted-foreground/70 md:text-xl">
                Match your skills, find dream jobs, and ace interviews with ease.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={index}
              className="flex h-full flex-col justify-between gap-8 rounded-2xl bg-violet-200 p-6"
            >
              <div className="flex flex-col gap-6">
                <p className="text-xl leading-relaxed font-medium text-foreground">
                  {testimonial.quote}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Author
                  image={testimonial.author.image}
                  role={testimonial.author.role}
                  name={testimonial.author.name}
                />
                <div className="w-24">
                  <img
                    className="w-full object-contain object-center opacity-80"
                    src={testimonial.company.logo}
                    alt={testimonial.company.name}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Case Studies */}
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {CASE_STUDIES.map((caseStudy, index) => (
            <a
              key={index}
              href={caseStudy.link}
              className="group relative flex aspect-square flex-col justify-between gap-8 overflow-hidden rounded-2xl  p-8 transition-all duration-300 hover:shadow-lg"
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100 transition-all duration-300 group-hover:scale-105 "
                style={{ backgroundImage: `url(${caseStudy.background})` }}
              />
              <div className="relative flex flex-col gap-3">
                <div className="text-5xl font-bold tracking-tight text-white transition-colors duration-300 ">
                  {caseStudy.stats[0].number}
                </div>
                <p className="text-sm font-medium text-muted-foreground transition-colors duration-300 text-white">
                  {caseStudy.stats[0].text}
                </p>
              </div>
              <div className="relative flex flex-col gap-6">
                <p className="text-xl leading-tight font-semibold text-white transition-colors duration-300 ">
                  {caseStudy.title}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export { TestimonialSection };