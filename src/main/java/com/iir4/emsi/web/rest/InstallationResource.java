package com.iir4.emsi.web.rest;

import com.iir4.emsi.domain.Installation;
import com.iir4.emsi.repository.InstallationRepository;
import com.iir4.emsi.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.iir4.emsi.domain.Installation}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class InstallationResource {

    private final Logger log = LoggerFactory.getLogger(InstallationResource.class);

    private static final String ENTITY_NAME = "installation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InstallationRepository installationRepository;

    public InstallationResource(InstallationRepository installationRepository) {
        this.installationRepository = installationRepository;
    }

    /**
     * {@code POST  /installations} : Create a new installation.
     *
     * @param installation the installation to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new installation, or with status {@code 400 (Bad Request)} if the installation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/installations")
    public ResponseEntity<Installation> createInstallation(@RequestBody Installation installation) throws URISyntaxException {
        log.debug("REST request to save Installation : {}", installation);
        if (installation.getId() != null) {
            throw new BadRequestAlertException("A new installation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Installation result = installationRepository.save(installation);
        return ResponseEntity
            .created(new URI("/api/installations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /installations/:id} : Updates an existing installation.
     *
     * @param id the id of the installation to save.
     * @param installation the installation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated installation,
     * or with status {@code 400 (Bad Request)} if the installation is not valid,
     * or with status {@code 500 (Internal Server Error)} if the installation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/installations/{id}")
    public ResponseEntity<Installation> updateInstallation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Installation installation
    ) throws URISyntaxException {
        log.debug("REST request to update Installation : {}, {}", id, installation);
        if (installation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, installation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!installationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Installation result = installationRepository.save(installation);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, installation.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /installations/:id} : Partial updates given fields of an existing installation, field will ignore if it is null
     *
     * @param id the id of the installation to save.
     * @param installation the installation to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated installation,
     * or with status {@code 400 (Bad Request)} if the installation is not valid,
     * or with status {@code 404 (Not Found)} if the installation is not found,
     * or with status {@code 500 (Internal Server Error)} if the installation couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/installations/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Installation> partialUpdateInstallation(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Installation installation
    ) throws URISyntaxException {
        log.debug("REST request to partial update Installation partially : {}, {}", id, installation);
        if (installation.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, installation.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!installationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Installation> result = installationRepository
            .findById(installation.getId())
            .map(existingInstallation -> {
                if (installation.getDateDebut() != null) {
                    existingInstallation.setDateDebut(installation.getDateDebut());
                }
                if (installation.getDateFin() != null) {
                    existingInstallation.setDateFin(installation.getDateFin());
                }

                return existingInstallation;
            })
            .map(installationRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, installation.getId().toString())
        );
    }

    /**
     * {@code GET  /installations} : get all the installations.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of installations in body.
     */
    @GetMapping("/installations")
    public List<Installation> getAllInstallations() {
        log.debug("REST request to get all Installations");
        return installationRepository.findAll();
    }

    /**
     * {@code GET  /installations/:id} : get the "id" installation.
     *
     * @param id the id of the installation to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the installation, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/installations/{id}")
    public ResponseEntity<Installation> getInstallation(@PathVariable Long id) {
        log.debug("REST request to get Installation : {}", id);
        Optional<Installation> installation = installationRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(installation);
    }

    /**
     * {@code DELETE  /installations/:id} : delete the "id" installation.
     *
     * @param id the id of the installation to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/installations/{id}")
    public ResponseEntity<Void> deleteInstallation(@PathVariable Long id) {
        log.debug("REST request to delete Installation : {}", id);
        installationRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
