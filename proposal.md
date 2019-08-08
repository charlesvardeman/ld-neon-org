# Possible demonstrator for ld.neon.org

## Leverage some of Zazuko infrastructure

[Zazuko](https://zazuko.com/) has built an open source linked data cyberinfrastructure as part of it's collaboration with the Swiss Government. The idea would be to create a linked data version of the existing field site landing pages. For example, [Abby Road](https://www.neonscience.org/field-sites/field-sites-map/ABBY) much like geo.admin.ch does for [Illnau-Effretikon](https://ld.geo.admin.ch/boundaries/municipality/296). This would require customizing [trifd](https://github.com/zazuko/trifid). Trifid requires a triple store with SPARQL endpoint which would be provided by the [OGC Geosparql enabled](https://jena.apache.org/documentation/geosparql/geosparql-fuseki) version of [Apache Jena Fuseki](https://jena.apache.org/documentation/fuseki2/). Additionally, landing pages would be built out for [observed properties](http://linkeddata.tern.org.au/viewer/corveg/id/http://linked.data.gov.au/def/corveg-cv/op) as created for the Australian TERN project. Abby Road plot descriptions would be modeled using the [TERN PLOT Ontology](http://www.linked.data.gov.au/def/plot/). A demonstrator data set landing page for Abby Road would be created with embedded Schema.org dataset description markup. The markup would be populated in part by SPARQL queries to ld.neon.org and validated using W3C [SHACL](https://www.w3.org/TR/shacl/). This can be extended in the future to generate the landing pages themselves using work [currently being developed by Tim Berners-Lee and the W3c](https://www.w3.org/DesignIssues/Footprints.html). The [ESIP schema.org dataset description](https://github.com/ESIPFed/science-on-schema.org/blob/master/guides/Dataset.md) would be extended to show how use the community standard [SWEET](https://github.com/ESIPFed/sweet) and ENVO(https://github.com/EnvironmentOntology/envo) ontologies as linked data using the schema.org additionalType and additionalProperty attributes. Lastly, a sample pipeline would be created to populate additional linked data using [Linked Data Pipelines](https://github.com/zazuko/barnard59-main) that use [rml](http://rml.io) to populate linked data from other data sources such as relational database tables. Tools like the [RMLmapper](https://github.com/RMLio/rmlmapper-java) can generate new field-sites automatically by mapping existing NEON database resources. The resultant demonstrator would be provided as a set of [docker containers](https://www.docker.com/) orchestrated by [docker-compose](https://docs.docker.com/compose/).