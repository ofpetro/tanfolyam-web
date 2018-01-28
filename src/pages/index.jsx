import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import React from 'react';
import { css } from 'react-emotion';
import Helmet from 'react-helmet';
import SimonyiLightLogoSrc from '../../static/assets/logos/simonyi-light.svg';
import Checkbox from '../components/Checkbox';
import Container from '../components/Container';
import InputGroup from '../components/InputGroup';
import RadioButton from '../components/RadioButton';
import { mediaQueries } from '../utils/media-queries';

class CoursesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerms: [],
    };

    this.handleSearchTermsChange = this.handleSearchTermsChange.bind(this);

    const { data } = props;

    this.allTags = Array.from(data.courses.edges.reduce((accumulator, { node }) => {
      // Count the global occurrence of each tag
      node.frontmatter.tags.forEach((tag) => {
        accumulator.set(tag, (accumulator.get(tag) || 0) + 1);
      });
      return accumulator;
    }, new Map()))
      .sort(([tag1, occurrenceCount1], [tag2, occurrenceCount2]) =>
        // Sort tags by occurrence count (descending) and then by name (ascending)
        (occurrenceCount1 !== occurrenceCount2
          ? occurrenceCount2 - occurrenceCount1
          : tag1.localeCompare(tag2)))
      .map(([tag]) =>
        // Drop occurrence counts
        tag);
  }

  handleSearchTermsChange({ target }) {
    const { checked, value } = target;

    if (checked) {
      this.setState(prevState => ({
        searchTerms: [...prevState.searchTerms, value],
      }));
    } else {
      this.setState(prevState => ({
        searchTerms: prevState.searchTerms.filter(searchTerm => searchTerm !== value),
      }));
    }
  }

  render() {
    const { data } = this.props;
    const { allTags } = this;

    return (
      <div>
        <Helmet title="Tanfolyamok" />

        <div
          className={css`
            position: relative;
          `}
        >
          <Img
            sizes={data.simonyiClubRoom.childImageSharp.sizes}
            className={css`
              filter: brightness(0.5);
            `}
          />
          <img
            src={SimonyiLightLogoSrc}
            alt=""
            className={css`
              position: absolute;
              width: 50%;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            `}
          />
        </div>

        <Container>
          <div
            className={css`
              ${mediaQueries.large(css`
                display: flex;
                margin: -2rem;

                > * {
                  flex: 50%;
                  padding: 2rem;
                }
              `)};
            `}
          >
            <div>
              <h2>
                <span role="img" aria-label="egy halom könyv">
                  📚
                </span>{' '}
                Tanfolyamjainkról
              </h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
            </div>

            <div>
              <h2>
                <span role="img" aria-label="nagyítóüveg">
                  🔍
                </span>{' '}
                Keresés a tanfolyamok között
              </h2>

              <form
                className={css`
                  label {
                    display: inline-block;
                    margin-right: 1em;

                    input[type='checkbox'],
                    input[type='radio'] {
                      margin-right: 0.42em;
                    }
                  }
                `}
              >
                <InputGroup name="programme" legend="Milyen szakra jársz?">
                  <RadioButton
                    value="computerEngineering"
                    label="Mérnökinformatikus"
                  />
                  <RadioButton
                    value="electricalEngineering"
                    label="Villamosmérnök"
                  />
                  <RadioButton value="other" label="Egyéb" />
                </InputGroup>

                <InputGroup name="startYear" legend="Melyik évben kezdtél?">
                  <RadioButton value="2017" />
                  <RadioButton value="2016" />
                  <RadioButton value="2015" />
                  <RadioButton value="other" label="Egyéb" />
                </InputGroup>

                <InputGroup
                  name="searchTerms"
                  legend="Milyen témakörök iránt érdeklődsz?"
                  onChange={this.handleSearchTermsChange}
                >
                  {allTags.map(tag => <Checkbox key={tag} value={tag} />)}
                </InputGroup>
              </form>
            </div>
          </div>

          <div>
            {data.courses.edges
              .filter(({ node }) =>
                // Show every course which has at least one of the desired tags
                // TODO: Sort results by relevance
                node.frontmatter.tags.some(tag =>
                  this.state.searchTerms.includes(tag)))
              .map(({ node }) => (
                <article
                  key={`${node.frontmatter.society.id}__${
                    node.frontmatter.title
                  }`}
                >
                  <div
                    className={css`
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    `}
                  >
                    <div>
                      <h3>{node.frontmatter.title}</h3>

                      <ul
                        className={css`
                          position: relative;
                          list-style: none;
                          padding-left: 1.75em;
                          line-height: 1.5;

                          li::before {
                            position: absolute;
                            left: 0;
                          }
                        `}
                      >
                        {node.frontmatter.date != null && (
                          <li
                            className={css`
                              ::before {
                                content: '🕓';
                              }
                            `}
                          >
                            <span aria-label="Időpont: " />
                            {node.frontmatter.date}
                          </li>
                        )}

                        {node.frontmatter.instructors != null && (
                          <li
                            className={css`
                              ::before {
                                content: '🎓';
                              }
                            `}
                          >
                            <span
                              aria-label={`${
                                node.frontmatter.instructors.length <= 1
                                  ? 'Oktató'
                                  : 'Oktatók'
                              }: `}
                            />
                            {node.frontmatter.instructors.join(', ')}
                          </li>
                        )}

                        {node.frontmatter.society.website != null && (
                          <li
                            className={css`
                              ::before {
                                content: '🌐';
                              }
                            `}
                          >
                            <span aria-label="A kör weboldala: " />
                            <a
                              href={node.frontmatter.society.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {/* Show the URL without protocol */}
                              {node.frontmatter.society.website.replace(
                                /(^\w+:|^)\/\//,
                                '',
                              )}
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>

                    <img
                      src={`/${node.frontmatter.society.logo.relativePath}`}
                      alt={`${node.frontmatter.society.id} logó`}
                      className={css`
                        width: 4em;
                        margin-left: 2rem;
                      `}
                    />
                  </div>

                  <div
                    className={css`
                      > :first-child {
                        margin-top: 0;
                      }

                      > :last-child {
                        margin-bottom: 0;
                      }
                    `}
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: node.html }}
                  />
                </article>
              ))}
          </div>
        </Container>
      </div>
    );
  }
}

CoursesPage.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

export default CoursesPage;

export const query = graphql`
  query CoursesPageQuery {
    courses: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/courses/" } }
    ) {
      edges {
        node {
          frontmatter {
            title
            society {
              id
              logo {
                relativePath
              }
              website
            }
            date(formatString: "LL", locale: "hu")
            instructors
            tags
          }
          html
        }
      }
    }

    simonyiClubRoom: file(
      relativePath: { eq: "assets/pictures/simonyi-club-room.jpeg" }
    ) {
      childImageSharp {
        sizes(maxWidth: 1920, maxHeight: 480, cropFocus: CENTER) {
          ...GatsbyImageSharpSizes
        }
      }
    }
  }
`;
