import Script from 'next/script';

const StructuredData = ({ type, data }) => {
  let schema = {};

  if (type === 'Organization') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Shwapner Thikana Ltd',
      url: 'https://shwapner-thikana.com',
      logo: 'https://shwapner-thikana.com/logo.png',
      sameAs: [
        'https://www.facebook.com/shwapnerthikana',
        'https://twitter.com/shwapnerthikana',
        'https://www.instagram.com/shwapnerthikana',
        'https://www.linkedin.com/company/shwapnerthikana'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+880-123-456-7890',
        contactType: 'customer service',
        areaServed: 'BD',
        availableLanguage: ['en', 'bn']
      }
    };
  } else if (type === 'WebSite') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Shwapner Thikana - Premium Real Estate',
      url: 'https://shwapner-thikana.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://shwapner-thikana.com/properties?search={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    };
  } else if (type === 'RealEstateListing') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateListing',
      name: data.title,
      description: data.description,
      image: data.images,
      url: `https://shwapner-thikana.com/properties/${data.slug}`,
      datePosted: data.createdAt,
      offers: {
        '@type': 'Offer',
        price: data.price,
        priceCurrency: 'BDT',
        availability: 'https://schema.org/InStock'
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.location?.address,
        addressLocality: data.location?.city,
        addressRegion: data.location?.area,
        addressCountry: 'BD'
      },
      ...data.extra
    };
  } else if (type === 'RealEstateAgent') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: data.name,
      description: data.bio || `Real Estate Agent at Shwapner Thikana`,
      image: data.image || data.avatar,
      url: `https://shwapner-thikana.com/agents/${data._id}`,
      telephone: data.phone,
      email: data.email,
      parentOrganization: {
        '@type': 'Organization',
        name: 'Shwapner Thikana Ltd'
      }
    };
  } else if (type === 'BreadcrumbList') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: data.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `https://shwapner-thikana.com${item.path}`
      }))
    };
  }

  return (
    <Script
      id={`json-ld-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
};

export default StructuredData;
