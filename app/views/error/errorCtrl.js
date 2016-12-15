angular.module('app.controller').controller('errorCtrl', ["$scope", "$rootScope", 
 function($scope, $rootScope) {
    $scope.status = $rootScope.status;
    /*$scope.checkStatus = function(){
        var fetched = false;
        for (var i = 0; i < $scope.message.length; i++) {
            var status = $scope.message[i].status;
            if ($scope.status == status) {
                $scope.detail = $scope.message[i];
                fetched = true;
                break;
            }
        }
        if (!fetched) {
            $scope.detail = {
                        status: $scope.status,
                        message: 'UNEXPECTED ERROR',
                        describe: 'An unknown problem occured. It may caused by a network issue or server issue. Please try again later or press below buttons to go to homepage or login screen.'
                    };
        }
    };
    $scope.message = [
                        // {
                        //     status: 100,
                        //     message: 'CONTINUE',
                        //     describe: 'The initial part of a request has been received and has not yet been rejected by the server. The server intends to send a final response after the request has been fully received and acted upon.',
                        // },
                        // {
                        //     status: 101,
                        //     message: 'SWITCHING PROTOCOLS',
                        //     describe: 'The server understands and is willing to comply with the client\'s request, via the Upgrade header field, for a change in the application protocol being used on this connection.',
                        // },
                        // {
                        //     status: 102,
                        //     message: 'PROCESSING',
                        //     describe: 'An interim response used to inform the client that the server has accepted the complete request, but has not yet completed it.',
                        // },
                        // {
                        //     status: 201,
                        //     message: 'CREATED',
                        //     describe: 'The request has been fulfilled and has resulted in one or more new resources being created.',
                        // },
                        // {
                        //     status: 202,
                        //     message: 'ACCEPTED',
                        //     describe: 'The request has been accepted for processing, but the processing has not been completed. The request might or might not eventually be acted upon, as it might be disallowed when processing actually takes place.',
                        // },
                        // {
                        //     status: 203,
                        //     message: 'NON-AUTHORITATIVE INFORMATION',
                        //     describe: 'The request was successful but the enclosed payload has been modified from that of the origin server\'s 200 OK response by a transforming proxy.',
                        // },
                        // {
                        //     status: 204,
                        //     message: 'NO CONTENT',
                        //     describe: 'The server has successfully fulfilled the request and that there is no additional content to send in the response payload body.',
                        // },
                        // {
                        //     status: 205,
                        //     message: 'RESET CONTENT',
                        //     describe: 'The server has fulfilled the request and desires that the user agent reset the "document view", which caused the request to be sent, to its original state as received from the origin server.',
                        // },
                        // {
                        //     status: 206,
                        //     message: 'PARTIAL CONTENT',
                        //     describe: 'The server is successfully fulfilling a range request for the target resource by transferring one or more parts of the selected representation that correspond to the satisfiable ranges found in the request\'s Range header field.',
                        // },
                        // {
                        //     status: 207,
                        //     message: 'MULTI-STATUS',
                        //     describe: 'A Multi-Status response conveys information about multiple resources in situations where multiple status codes might be appropriate.',
                        // },
                        // {
                        //     status: 208,
                        //     message: 'ALREADY REPORTED',
                        //     describe: 'Used inside a DAV: propstat response element to avoid enumerating the internal members of multiple bindings to the same collection repeatedly.',
                        // },
                        // {
                        //     status: 226,
                        //     message: 'IM USED',
                        //     describe: 'The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.',
                        // },
                        {
                            status: 300,
                            message: 'MULTIPLE CHOICES',
                            describe: 'The target resource has more than one representation, each with its own more specific identifier, and information about the alternatives is being provided so that the user (or user agent) can select a preferred representation by redirecting its request to one or more of those identifiers.',
                        },
                        {
                            status: 301,
                            message: 'MOVED PERMANENTLY',
                            describe: 'The target resource has been assigned a new permanent URI and any future references to this resource ought to use one of the enclosed URIs.',
                        },
                        {
                            status: 302,
                            message: 'FOUND',
                            describe: 'The target resource resides temporarily under a different URI. Since the redirection might be altered on occasion, the client ought to continue to use the effective request URI for future requests.',
                        },
                        {
                            status: 303,
                            message: 'SEE OTHER',
                            describe: 'The server is redirecting the user agent to a different resource, as indicated by a URI in the Location header field, which is intended to provide an indirect response to the original request.',
                        },
                        {
                            status: 304,
                            message: 'NOT MODIFIED',
                            describe: 'A conditional GET or HEAD request has been received and would have resulted in a 200 OK response if it were not for the fact that the condition evaluated to false.',
                        },
                        {
                            status: 305,
                            message: 'USE PROXY',
                            describe: 'Defined in a previous version of this specification and is now deprecated, due to security concerns regarding in-band configuration of a proxy.',
                        },
                        {
                            status: 307,
                            message: 'TEMPORARY REDIRECT',
                            describe: 'The target resource resides temporarily under a different URI and the user agent MUST NOT change the request method if it performs an automatic redirection to that URI.',
                        },
                        {
                            status: 308,
                            message: 'PERMANENT REDIRECT',
                            describe: 'The target resource has been assigned a new permanent URI and any future references to this resource ought to use one of the enclosed URIs.',
                        },
                        {
                            status: 400,
                            message: 'BAD REQUEST',
                            describe: 'The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing)',
                        },
                        {
                            status: 402,
                            message: 'PAYMENT REQUIRED',
                            describe: 'Reserved for future use.',
                        },
                        {
                            status: 403,
                            message: 'FORBIDDEN',
                            describe: 'The server understood the request but refuses to authorize it.',
                        },
                        {
                            status: 405,
                            message: 'METHOD NOT ALLOWED',
                            describe: 'The method received in the request-line is known by the origin server but not supported by the target resource.',
                        },
                        {
                            status: 406,
                            message: 'NOT ACCEPTABLE',
                            describe: 'The target resource does not have a current representation that would be acceptable to the user agent, according to the proactive negotiation header fields received in the request, and the server is unwilling to supply a default representation.',
                        },
                        {
                            status: 407,
                            message: 'PROXY AUTHENTICATION REQUIRED',
                            describe: 'Similar to 401 Unauthorized, but it indicates that the client needs to authenticate itself in order to use a proxy.',
                        },
                        {
                            status: 408,
                            message: 'REQUEST TIMEOUT',
                            describe: 'The server did not receive a complete request message within the time that it was prepared to wait.',
                        },
                        {
                            status: 409,
                            message: 'CONFLICT',
                            describe: 'The request could not be completed due to a conflict with the current state of the target resource. This code is used in situations where the user might be able to resolve the conflict and resubmit the request.',
                        },
                        {
                            status: 410,
                            message: 'GONE',
                            describe: 'The target resource is no longer available at the origin server and that this condition is likely to be permanent.',
                        },
                        {
                            status: 411,
                            message: 'LENGTH REQUIRED',
                            describe: 'The server refuses to accept the request without a defined Content-Length.',
                        },
                        {
                            status: 412,
                            message: 'PRECONDITION FAILED',
                            describe: 'One or more conditions given in the request header fields evaluated to false when tested on the server.',
                        },
                        {
                            status: 413,
                            message: 'PAYLOAD TOO LARGE',
                            describe: 'The server is refusing to process a request because the request payload is larger than the server is willing or able to process.',
                        },
                        {
                            status: 414,
                            message: 'REQUEST-URI TOO LONG',
                            describe: 'The server is refusing to service the request because the request-target is longer than the server is willing to interpret.',
                        },
                        {
                            status: 415,
                            message: 'UNSUPPORTED MEDIA TYPE',
                            describe: 'The origin server is refusing to service the request because the payload is in a format not supported by this method on the target resource.',
                        },
                        {
                            status: 416,
                            message: 'REQUESTED RANGE NOT SATISFIABLE',
                            describe: 'None of the ranges in the request is Range header field overlap the current extent of the selected resource or that the set of ranges requested has been rejected due to invalid ranges or an excessive request of small or overlapping ranges.',
                        },
                        {
                            status: 417,
                            message: 'EXPECTATION FAILED',
                            describe: 'The expectation given in the request is Expect header field could not be met by at least one of the inbound servers.',
                        },
                        {
                            status: 418,
                            message: 'I AM A TEAPOT',
                            describe: 'Any attempt to brew coffee with a teapot should result in the error code "418 I\'m a teapot". The resulting entity body MAY be short and stout.',
                        },
                        {
                            status: 421,
                            message: 'MISDIRECTED REQUEST',
                            describe: 'The request was directed at a server that is not able to produce a response. This can be sent by a server that is not configured to produce responses for the combination of scheme and authority that are included in the request URI.',
                        },
                        {
                            status: 422,
                            message: 'UNPROCESSABLE ENTITY',
                            describe: 'The server understands the content type of the request entity (hence a 415 Unsupported Media Type status code is inappropriate), and the syntax of the request entity is correct (thus a 400 Bad Request status code is inappropriate) but was unable to process the contained instructions.',
                        },
                        {
                            status: 423,
                            message: 'LOCKED',
                            describe: 'The source or destination resource of a method is locked.',
                        },
                        {
                            status: 424,
                            message: 'FAILED DEPENDENCY',
                            describe: 'The method could not be performed on the resource because the requested action depended on another action and that action failed.',
                        },
                        {
                            status: 426,
                            message: 'UPGRADE REQUIRED',
                            describe: 'The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.',
                        },
                        {
                            status: 428,
                            message: 'PRECONDITION REQUIRED',
                            describe: 'The origin server requires the request to be conditional.',
                        },
                        {
                            status: 429,
                            message: 'TOO MANY REQUESTS',
                            describe: 'The user has sent too many requests in a given amount of time ("rate limiting").',
                        },
                        {
                            status: 431,
                            message: 'REQUEST HEADER FIELDS TOO LARGE',
                            describe: 'The server is unwilling to process the request because its header fields are too large. The request MAY be resubmitted after reducing the size of the request header fields.',
                        },
                        {
                            status: 444,
                            message: 'CONNECTION CLOSED WITHOUT RESPONSE',
                            describe: 'A non-standard status code used to instruct nginx to close the connection without sending a response to the client, most commonly used to deny malicious or malformed requests.',
                        },
                        {
                            status: 451,
                            message: 'UNAVAILABLE FOR LEGAL REASONS',
                            describe: 'The server is denying access to the resource as a consequence of a legal demand.',
                        },
                        {
                            status: 499,
                            message: 'CLIENT CLOSED REQUEST',
                            describe: 'A non-standard status code introduced by nginx for the case when a client closes the connection while nginx is processing the request.',
                        },
                        {
                            status: 500,
                            message: 'INTERNAL SERVER ERROR',
                            describe: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
                        },
                        {
                            status: 501,
                            message: 'NOT IMPLEMENTED',
                            describe: 'The server does not support the functionality required to fulfill the request.',
                        },
                        {
                            status: 502,
                            message: 'BAD GATEWAY',
                            describe: 'The server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request.',
                        },
                        {
                            status: 503,
                            message: 'SERVICE UNAVAILABLE',
                            describe: 'The server is currently unable to handle the request due to a temporary overload or scheduled maintenance, which will likely be alleviated after some delay.',
                        },
                        {
                            status: 504,
                            message: 'GATEWAY TIMEOUT',
                            describe: 'The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server it needed to access in order to complete the request.',
                        },
                        {
                            status: 505,
                            message: 'HTTP VERSION NOT SUPPORTED',
                            describe: 'The server does not support, or refuses to support, the major version of HTTP that was used in the request message.',
                        },
                        {
                            status: 506,
                            message: 'VARIANT ALSO NEGOTIATES',
                            describe: 'The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.',
                        },
                        {
                            status: 507,
                            message: 'INSUFFICIENT STORAGE',
                            describe: 'The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.',
                        },
                        {
                            status: 508,
                            message: 'LOOP DETECTED',
                            describe: 'The server terminated an operation because it encountered an infinite loop while processing a request with "Depth: infinity". This status indicates that the entire operation failed.',
                        },
                        {
                            status: 510,
                            message: 'NOT EXTENDED',
                            describe: 'The policy for accessing the resource has not been met in the request. The server should send back all the information necessary for the client to issue an extended request.',
                        },
                        {
                            status: 511,
                            message: 'NETWORK AUTHENTICATION REQUIRED',
                            describe: 'The client needs to authenticate to gain network access.',
                        },
                        {
                            status: 599,
                            message: 'NETWORK CONNECT TIMEOUT ERROR',
                            describe: 'This status code is not specified in any RFCs, but is used by some HTTP proxies to signal a network connect timeout behind the proxy to a client in front of the proxy.',
                        },
                        {
                            status: 902,
                            message: 'AUTHRIZATION FAILED',
                            describe: 'You are not authrized to access the url / resource you requested. You don\'t have the necessary permission.',
                        },

                    ];
     $scope.checkStatus();*/
}]);
