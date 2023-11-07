// Declare a module for 'manticoresearch'
declare module "manticoresearch" {
  // Define the MatchFilter class according to provided properties
  export class MatchFilter {
    queryString: string;
    queryFields: string;
    constructor(queryString: string, queryFields: string);
  }

  // Define the SearchRequest class according to provided properties
  export class SearchRequest {
    index: string;
    query?: any;
    fulltext_filter?: any;
    attrFilter?: any;
    limit?: number;
    offset?: number;
    maxMatches?: number;
    sort?: any[];
    aggs?: any[];
    expressions?: any[];
    highlight?: any;
    source?: any;
    options?: { [key: string]: any };
    profile?: boolean;
    trackScores?: boolean;
    constructor();
  }

  // Define the SearchApi class and its method signatures
  export class SearchApi {
    constructor(client: ApiClient);
    search(searchRequest: SearchRequest): Promise<SearchResponse>;
  }

  // Define the SearchResponseHits class according to provided properties
  export class SearchResponseHits {
    maxScore?: number;
    total?: number;
    totalRelation?: string;
    hits?: any[];
  }

  // Define the SearchResponse class according to provided properties
  export class SearchResponse {
    took?: number;
    timedOut?: boolean;
    aggregations?: { [key: string]: any };
    hits?: SearchResponseHits;
    profile?: any;
    warning?: { [key: string]: any };
  }

  // Define the ApiClient class with at least the basePath property
  export class ApiClient {
    basePath: string;
    constructor();
  }

  // Any other classes or types needed from the manticoresearch module should be defined here.
}
